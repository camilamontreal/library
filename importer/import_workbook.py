#!/usr/bin/env python3
"""Workbook importer (read-only on the workbook).

Usage: python3 importer/import_workbook.py WORKBOOK.xlsx [--out importer/out]

Writes to --out:
  report.md               dry-run summary to review before loading
  review_candidates.csv   possible duplicates (become the Revisão queue)
  unparsed_values.csv     cell values the importer could not interpret (kept raw)
  import.sql              load script: psql "$DATABASE_URL" -f import.sql

Rules: every non-empty row is kept in source_record (raw values + hyperlinks).
Only strong evidence merges automatically; everything else becomes a review candidate.
"""
import argparse, collections, csv, datetime as dt, json, os, re, unicodedata, uuid
import openpyxl

# Account attribution. None = uncertain -> publication.account left empty and flagged.
VP_IG_ACCOUNT = None  # Instagram links in "Vídeos Postados" do not say which account posted them.

CAND_MIN = 0.5        # minimum title similarity for a review candidate
GENERIC = {"live", "alerta spoiler", "eu no brasil", "trend", "meme", "vlog", "depoimento"}
STOP = set("de da do das dos no na nos nas em e o a os as um uma pra para com que meu minha "
           "the in of my to and shorts short".split())
STATUS = {"falta conteudo": "needs_footage", "pronto para editar": "ready_to_edit", "editado": "edited",
          "em edicao": "editing", "agendado": "scheduled", "postado": "published", "aprovado": "edited"}
PRIORITY = {"alta": "alta", "media": "media", "baixa": "baixa"}


# ---------- helpers ----------
def norm(s):
    s = unicodedata.normalize("NFKD", str(s or "")).encode("ascii", "ignore").decode().lower()
    return re.sub(r"\s+", " ", s).strip()

def norm_title(s):
    s = re.sub(r"#\w+|\(ok\)", " ", norm(s))  # hashtags and the "(OK)" status marker
    return re.sub(r"[^a-z0-9]+", " ", s).strip()

def trigrams(t):
    out = set()
    for w in t.split():
        if w in STOP:
            continue
        w = f"  {w} "
        out.update(w[i:i + 3] for i in range(len(w) - 2))
    return out

def sim(a, b):
    return len(a & b) / len(a | b) if a and b else 0.0

def text(c):
    v = c.value
    if v is None:
        return ""
    if isinstance(v, (dt.datetime, dt.date)):
        return v.date().isoformat() if isinstance(v, dt.datetime) else v.isoformat()
    if isinstance(v, float) and v.is_integer():
        v = int(v)
    return str(v).strip()

URL_RE = re.compile(r"https?://[^\s<>\"']+")

def urls(c):
    out = []
    if c.hyperlink and c.hyperlink.target:
        out.append(c.hyperlink.target.strip())
    for u in URL_RE.findall(text(c)):
        if u not in out:
            out.append(u)
    return out

def classify(u):
    if re.search(r"instagram\.com/reels?/audio/", u):
        return ("asset", "audio_ref")
    m = re.search(r"instagram\.com/(?:[A-Za-z0-9_.]+/)?(?:reels?|p|tv)/([A-Za-z0-9_-]+)", u)
    if m:
        return ("instagram", m.group(1))
    m = re.search(r"tiktok\.com/@([^/?]+)/video/(\d+)", u)
    if m:
        return ("tiktok", m.group(2), m.group(1))
    m = re.search(r"(?:youtube\.com/(?:shorts/|watch\?v=|live/)|youtu\.be/)([A-Za-z0-9_-]{11})", u)
    if m:
        return ("youtube", m.group(1))
    if "drive.google.com/drive/folders" in u:
        return ("asset", "drive_folder")
    if "drive.google.com" in u or "docs.google.com" in u:
        return ("asset", "drive_file")
    if "photos.app.goo.gl" in u or "photos.google.com" in u:
        return ("asset", "photos_album")
    if "canva" in u:
        return ("asset", "canva")
    return ("asset", "other")


# ---------- in-memory model ----------
class Model:
    def __init__(self, workbook):
        self.workbook = workbook
        self.sources, self.contents, self.ideas, self.inspirations, self.cands = [], [], [], [], {}
        self.pub_ids = {}      # (platform, platform_id) -> pub
        self.ig, self.yt, self.tt = {}, {}, {}  # reliable platform id -> content
        self.unparsed, self.stats, self.flags = [], collections.Counter(), collections.Counter()
        self.sheet_rows = collections.Counter()
        self.accounts = {}

    def source(self, ws, row, note=None):
        raw = {}
        hdr = self.headers.get(ws.title, {})
        for c in row:
            v, link = c.value, (c.hyperlink.target if c.hyperlink else None)
            if (v is None or str(v).strip() == "") and not link:
                continue
            key = f"{c.column_letter}:{hdr.get(c.column_letter, '')}".rstrip(":")
            raw[key] = {"v": text(c)} | ({"link": link} if link else {})
        rec = {"id": len(self.sources) + 1, "sheet": ws.title, "row": row[0].row, "raw": raw,
               "note": note, "content_id": None, "idea_id": None, "inspiration_id": None}
        self.sources.append(rec)
        self.sheet_rows[ws.title] += 1
        return rec

    def content(self, src, title, **kw):
        c = {"id": str(uuid.uuid4()), "title": title, "kind": "short", "status": "idea", "priority": None,
             "destination": None, "topics": [], "season": None, "notes": [], "editor": None,
             "audio_notes": [], "references_text": [], "needs_review": False, "pubs": [], "assets": [],
             "origin": src["sheet"], "cand": False}
        c.update(kw)
        self.contents.append(c)
        src["content_id"] = c["id"]
        return c

    def attach(self, c, src, rule):
        src["content_id"] = c["id"]
        self.stats[f"auto-match: {rule}"] += 1

    def asset(self, c, src, u, typ=None, label=None, note=None):
        if any(a["url"] == u and (a["label"] == label) for a in c["assets"]):
            return
        c["assets"].append({"type": typ or (classify(u)[1] if u else "other"), "url": u, "label": label,
                            "note": note, "src": src["id"]})

    def pub(self, c, src, platform, account=None, status="unknown", platform_id=None, flags=(), **kw):
        """Add or enrich a publication. Same platform id, or same platform+account without id, = same row."""
        if account is False:
            account, flags = None, list(flags) + ["account_uncertain"]
        flags = list(flags)
        if platform_id:
            existing = self.pub_ids.get((platform, platform_id))
            if existing and existing["content"] is not c:
                # id already used by another content: keep the url, never force a merge
                flags.append("duplicate_platform_id")
                platform_id = None
            elif existing:
                return self._enrich(existing, status, flags, kw)
        if not platform_id:
            for p in c["pubs"]:
                if p["platform"] == platform and p["account"] == account and not p["platform_id"] \
                        and "duplicate_platform_id" not in flags:
                    return self._enrich(p, status, flags, kw)
        p = {"id": str(uuid.uuid4()), "content": c, "platform": platform, "account": account,
             "status": status, "platform_id": platform_id, "flags": flags, "src": src["id"], "notes": [],
             "url": None, "title": None, "published_at": None, "published_at_raw": None,
             "date_confidence": "none", "posted_by": None, "parts": None, "duration_s": None, "metrics": None}
        for k, v in kw.items():
            if k == "notes":
                p["notes"] += v
            elif v is not None:
                p[k] = v
        c["pubs"].append(p)
        if platform_id:
            self.pub_ids[(platform, platform_id)] = p
        return p

    @staticmethod
    def _enrich(p, status, flags, kw):
        rank = ["published", "pending", "unknown", "skipped"]
        if rank.index(status) < rank.index(p["status"]):
            p["status"] = status
        p["flags"] = sorted(set(p["flags"]) | set(flags))
        for k, v in kw.items():
            if k == "notes":
                p["notes"] += [n for n in v if n not in p["notes"]]
            elif k == "published_at_raw" and v and p.get(k) and v != p[k]:
                p[k] = f"{p[k]} | {v}"
            elif k == "published_at" and v and (not p[k] or p["date_confidence"] != "high"):
                p[k] = v
                p["date_confidence"] = kw.get("date_confidence", "high")
            elif k == "date_confidence":
                continue
            elif v is not None and not p.get(k):
                p[k] = v
        return p

    def unparsed_value(self, sheet, row, col, value, why):
        self.unparsed.append((sheet, row, col, value, why))


def reliable_ids(rows, extract):
    """Platform ids are reliable inside a sheet only if every row carrying them has the same title."""
    seen = collections.defaultdict(set)
    for r in rows:
        for pid, title in extract(r):
            seen[pid].add(norm_title(title))
    return {pid for pid, titles in seen.items() if len(titles) == 1}


# ---------- distribution cell parsing ----------
DATE_RE = re.compile(r"(?<!\d)(\d{1,2})/(\d{1,2})(?:/(\d{2,4}))?(?![\d/])")

def parse_dist(c, ig_column=False):
    v = c.value
    out = {"status": "pending", "raw": None, "by": None, "at": None, "conf": "none", "flags": [], "dm": None}
    if v is None or str(v).strip() == "":
        return out
    if isinstance(v, dt.datetime):
        out.update(status="published", raw=v.date().isoformat(), at=v.date(), conf="high")
        return out
    s = str(v).strip()
    out["raw"] = s
    n = norm(s)
    by = re.findall(r"\((j|c|jack)\)", n)
    if by:
        out["by"] = "C" if by[0] == "c" else "J"
    if n in ("x", "(x)") or "(x)" in n or "ja foi postado" in n or by:
        out["status"] = "published"
    if "ja tem" in n:
        out["status"] = "published"
        out["flags"].append("ja_tem")
    if "tt baby" in n:
        out["flags"].append("other_account_mentioned")
    dates = DATE_RE.findall(s)
    if len(dates) > 1 or " e " in f" {n} " or " / " in s:
        out["flags"].append("multiple_dates")
    if dates and out["status"] == "pending":
        out["status"] = "published"
    if out["status"] == "pending":
        out["status"] = "unknown"
        return out
    if dates:
        d, m, y = (int(dates[0][0]), int(dates[0][1]), dates[0][2])
        if y:
            yy = int(y) + (2000 if len(y) == 2 else 0)
            try:
                out["at"], out["conf"] = dt.date(yy, m, d), "high"
            except ValueError:
                pass
        elif not ig_column and 1 <= d <= 31 and 1 <= m <= 12:
            out["dm"] = (d, m)   # year to be inferred later, only with strong evidence
    return out

def parse_flag(c):
    s = norm(text(c))
    if s == "":
        return "pending", None
    if s in ("ok", "x"):
        return "published", None
    if s == "ok 1/2":
        return "published", 2
    return "unknown", None

def parse_views(s):
    m = re.fullmatch(r"(\d+(?:[.,]\d+)?)\s*([km])?", norm(s))
    if not m:
        return None
    n = float(m.group(1).replace(",", "."))
    return int(n * {"k": 1_000, "m": 1_000_000}.get(m.group(2), 1))


# ---------- sheet importers ----------
def rows_of(ws, start=2, stop=None):
    for r in ws.iter_rows(min_row=start, max_row=stop or ws.max_row):
        if any((c.value is not None and str(c.value).strip()) or c.hyperlink for c in r):
            yield r

def status_of(s, default="idea"):
    return STATUS.get(norm(s), default)

def ig_account(handle):
    return M.accounts.get(("instagram", handle))


def import_videos_postados(ws):
    rows = list(rows_of(ws))
    def ids(r):
        for u in urls(r[1]):
            k = classify(u)
            if k[0] == "instagram":
                yield k[1], text(r[0])
    ok = reliable_ids(rows, ids)
    for r in rows:
        src = M.source(ws, r)
        title = text(r[0])
        links = urls(r[1])
        code = next((classify(u)[1] for u in links if classify(u)[0] == "instagram"), None)
        if code and code in ok and code in M.ig:
            c = M.ig[code]
            M.attach(c, src, "same Instagram post within Vídeos Postados")
        else:
            tema, local = text(r[3]), text(r[4])
            falta = "falta postar" in norm(text(r[2]))
            c = M.content(src, title, status="edited" if falta else "published",
                          kind="live" if norm(tema) == "live" or norm(title).startswith("live") else "short",
                          topics=[tema] if tema and norm(tema) != "x" else [],
                          destination=local if local and norm(local) != "x" else None, cand=False)
            if falta:
                c["notes"].append("Vídeos Postados: FALTA POSTAR")
            if code and code in ok:
                M.ig[code] = c
        for u in links:
            k = classify(u)
            if k[0] == "instagram":
                M.pub(c, src, "instagram", account=ig_account(VP_IG_ACCOUNT) if VP_IG_ACCOUNT else False,
                      status="published", platform_id=k[1], url=u)
            else:
                lbl = text(r[1]) if not URL_RE.match(text(r[1])) else None
                M.asset(c, src, u, label=lbl)
        for u in urls(r[2]):
            M.asset(c, src, u, typ="other", label="Sem legenda")
        for i, lbl in ((5, "Observação"), (6, "Post")):
            if text(r[i]):
                c["notes"].append(f"{lbl}: {text(r[i])}")
        # Column H holds sheet-level instructions/links; kept in source_record only.
        if text(r[7]) or r[7].hyperlink:
            M.flags["Vídeos Postados col H (sheet notes) kept in provenance only"] += 1


def title_index():
    idx = collections.defaultdict(list)
    for c in M.contents:
        idx[norm_title(c["title"])].append(c)
    return idx


def find_by_title(title, sheet_titles, idx):
    """Exact title match: unique on both sides, at least 2 words, not generic."""
    t = norm_title(title)
    if not t or t in GENERIC or len(t.split()) < 2 or sheet_titles[t] > 1:
        return None
    hits = idx.get(t, [])
    return hits[0] if len(hits) == 1 else None


def import_para_postar(ws):
    rows = list(rows_of(ws))
    def ids(r):
        for u in urls(r[2]):
            k = classify(u)
            if k[0] == "instagram":
                yield k[1], text(r[1])
    ok = reliable_ids(rows, ids)
    idx = title_index()
    titles = collections.Counter(norm_title(text(r[1])) for r in rows)
    yt_acc, tt_acc = M.accounts[("youtube", "camilamontreal")], M.accounts[("tiktok", "camilamontreal")]
    cols = {3: ("youtube_short", yt_acc), 4: ("instagram", ig_account("camilamontreal")),
            5: ("tiktok", tt_acc), 6: ("instagram", ig_account("mundodacami"))}
    pending_dm = []
    for r in rows:
        src = M.source(ws, r)
        title = text(r[1])
        links = urls(r[2])
        code = next((classify(u)[1] for u in links if classify(u)[0] == "instagram"), None)
        c = None
        if code and code in ok and code in M.ig:
            c = M.ig[code]
            M.attach(c, src, "same Instagram post (Para Postar → Vídeos Postados)")
        if not c:
            c = find_by_title(title, titles, idx)
            if c and c["origin"] == "Vídeos Postados":
                M.attach(c, src, "exact unique title (Para Postar → Vídeos Postados)")
            else:
                c = None
        if not c:
            c = M.content(src, title or f"[sem título] Para Postar linha {r[0].row}", status="edited",
                          needs_review=True, cand=True)
            if code and code in ok:
                M.ig[code] = c
        for u in links:
            k = classify(u)
            if k[0] == "instagram":
                M.pub(c, src, "instagram", account=False, status="published", platform_id=k[1], url=u)
            elif k[0] == "tiktok":
                M.pub(c, src, "tiktok", account=tt_acc, status="published", platform_id=k[1], url=u)
            else:
                lbl = text(r[2]) if not URL_RE.match(text(r[2])) else None
                M.asset(c, src, u, label=lbl)
        if text(r[0]) and not c["season"]:
            c["season"] = text(r[0])
        if text(r[7]):
            c["notes"].append(f"Para Postar: {text(r[7])}")
        for i, (platform, acc) in cols.items():
            d = parse_dist(r[i], ig_column=(platform == "instagram"))
            if d["raw"] is None and d["status"] == "pending" and platform == "instagram":
                continue  # empty IG columns: Para Postar is about distributing elsewhere
            if d["status"] == "unknown":
                M.unparsed_value(ws.title, r[0].row, i + 1, d["raw"], "distribution cell")
            flags = d["flags"]
            p = M.pub(c, src, platform, account=acc, status=d["status"], posted_by=d["by"],
                      published_at=d["at"], published_at_raw=d["raw"],
                      date_confidence=d["conf"] if d["at"] else None, flags=flags)
            if d["at"]:
                p["date_confidence"] = "high"
            if d["dm"]:
                pending_dm.append((i, r[0].row, d["dm"], p))
            for f in flags:
                M.flags[f"Para Postar: {f}"] += 1
        if c["status"] != "published" and any(p["status"] == "published" for p in c["pubs"]):
            c["status"] = "published"
    infer_years(ws, rows, pending_dm)


def infer_years(ws, rows, pending):
    """Year only from strong evidence: same day/month with a full date in the same row,
    or full-dated neighbours (±10 rows, same column) with one year bracketing the date."""
    full = collections.defaultdict(dict)  # col -> row -> date
    for r in rows:
        for i in (3, 4, 5, 6):
            d = parse_dist(r[i])
            if d["at"]:
                full[i][r[0].row] = d["at"]
    for col, row, (d, m), p in pending:
        year = None
        for i in full:
            other = full[i].get(row)
            if other and (other.day, other.month) == (d, m):
                year = other.year
        if year is None:
            above = [full[col][k] for k in sorted(full[col]) if row - 10 <= k < row]
            below = [full[col][k] for k in sorted(full[col]) if row < k <= row + 10]
            if above and below and above[-1].year == below[0].year:
                y = above[-1].year
                try:
                    cand = dt.date(y, m, d)
                except ValueError:
                    cand = None
                if cand and min(above[-1], below[0]) <= cand <= max(above[-1], below[0]):
                    year = y
        if year:
            try:
                p["published_at"], p["date_confidence"] = dt.date(year, m, d), "inferred"
                M.stats["dates: year inferred"] += 1
            except ValueError:
                pass
        else:
            M.stats["dates: year unknown (kept raw)"] += 1


def import_shorts_tiktok(ws):
    rows = list(rows_of(ws))
    def ids(r):
        t = text(r[4]) if parse_views(text(r[4])) is None and norm(text(r[4])) != "repost" else ""
        for col in (0, 5):
            for u in urls(r[col]):
                k = classify(u)
                if k[0] in ("instagram", "youtube", "tiktok"):
                    yield (k[0], k[1]), t or text(r[0])
    ok = reliable_ids(rows, ids)
    idx = title_index()
    titles = collections.Counter()
    yt_acc, tt_acc = M.accounts[("youtube", "camilamontreal")], M.accounts[("tiktok", "camilamontreal")]
    for r in rows:
        a, e = text(r[0]), text(r[4])
        titles[norm_title(e if e and parse_views(e) is None and norm(e) != "repost" else ("" if urls(r[0]) else a))] += 1
    for r in rows:
        src = M.source(ws, r)
        a_urls, e = urls(r[0]), text(r[4])
        views = parse_views(e)
        repost = norm(e) == "repost"
        title = e if e and views is None and not repost else ("" if a_urls else text(r[0]))
        plat_links = [(classify(u), u) for col in (0, 5) for u in urls(r[col])]
        c, rule = None, None
        for k, u in plat_links:
            index = {"instagram": M.ig, "youtube": M.yt, "tiktok": M.tt}.get(k[0])
            if index is not None and (k[0], k[1]) in ok and k[1] in index:
                c, rule = index[k[1]], f"same {k[0]} id (Shorts & TikTok)"
                break
        if not c and title:
            c = find_by_title(title, titles, idx)
            rule = "exact unique title (Shorts & TikTok)" if c else None
        if c:
            M.attach(c, src, rule)
        else:
            placeholder = next((f"[sem título] {k[0]} {k[1]}" for k, u in plat_links if k[0] != "asset"),
                               f"[sem título] Shorts & TikTok linha {r[0].row}")
            c = M.content(src, title or placeholder, status="published", needs_review=True, cand=bool(title))
        for k, u in plat_links:
            if k[0] == "instagram":
                p = M.pub(c, src, "instagram", account=False, status="published", platform_id=k[1], url=u)
                if (k[0], k[1]) in ok:
                    M.ig.setdefault(k[1], c)
            elif k[0] == "tiktok":
                acc = M.accounts.get(("tiktok", k[2]))
                M.pub(c, src, "tiktok", account=acc or False, status="published", platform_id=k[1], url=u)
                if (k[0], k[1]) in ok:
                    M.tt.setdefault(k[1], c)
            elif k[0] == "youtube":
                M.pub(c, src, "youtube_short", account=yt_acc, status="published", platform_id=k[1], url=u)
                if (k[0], k[1]) in ok:
                    M.yt.setdefault(k[1], c)
            else:
                M.asset(c, src, u)
        for col in (6,):
            for u in urls(r[col]):
                M.asset(c, src, u)
        ig_status, _ = parse_flag(r[1])
        igp = next((p for p in c["pubs"] if p["platform"] == "instagram"), None)
        if ig_status == "published" and not igp:
            igp = M.pub(c, src, "instagram", account=False, status="published")
        if igp and (views is not None or repost):
            if views is not None:
                igp["metrics"] = {"views": views, "views_text": e, "source": "Shorts & TikTok"}
            if repost:
                igp["flags"] = sorted(set(igp["flags"]) | {"repost"})
                M.flags["Shorts & TikTok: REPOST"] += 1
        date_note = []
        if isinstance(r[5].value, dt.datetime):
            date_note = [f"Data de postagem (Shorts & TikTok, plataforma não especificada): {text(r[5])}"]
        h = text(r[7])
        for i, platform, acc in ((2, "tiktok", tt_acc), (3, "youtube_short", yt_acc)):
            st, parts = parse_flag(r[i])
            if st == "unknown":
                M.unparsed_value(ws.title, r[0].row, i + 1, text(r[i]), "status flag")
            flags = ["nao_postar_note"] if "nao postar" in norm(h) and st == "published" else []
            if flags:
                M.flags["Shorts & TikTok: marked published but note says NÃO POSTAR"] += 1
            M.pub(c, src, platform, account=acc, status=st, parts=parts, flags=flags,
                  published_at_raw=text(r[i]) or None, notes=date_note)
        obs = text(r[6])
        if obs and not urls(r[6]) and obs != "#ERROR!":
            c["notes"].append(f"Shorts & TikTok: {obs}")
        if h:
            c["notes"].append(f"Shorts & TikTok: {h}")
        if c["status"] != "published" and any(p["status"] == "published" for p in c["pubs"]):
            c["status"] = "published"


def import_youtube_export(ws):
    hdr_row = next(r for r in ws.iter_rows() if text(r[0]) == "Conteúdo")
    names = [text(c) for c in hdr_row]
    M.headers[ws.title] = {c.column_letter: n for c, n in zip(hdr_row, names)}
    yt_acc = M.accounts[("youtube", "camilamontreal")]
    for r in rows_of(ws, start=hdr_row[0].row):
        vid = text(r[0])
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", vid):
            M.source(ws, r, note="cabeçalho/total do export do YouTube Studio")
            continue
        src = M.source(ws, r)
        title = text(r[1])
        try:
            published = dt.datetime.strptime(text(r[2]), "%b %d, %Y").date()
        except ValueError:
            published = None
        dur = int(r[3].value) if isinstance(r[3].value, (int, float)) else None
        is_short = "#short" in title.lower() or (dur is not None and dur <= 60)
        platform = "youtube_short" if is_short else "youtube"
        flags = ["maybe_short"] if not is_short and dur and dur <= 180 else []
        metrics = {n: r[i].value for i, n in enumerate(names) if i >= 4 and n and isinstance(r[i].value, (int, float))}
        url = f"https://www.youtube.com/{'shorts/' + vid if is_short else 'watch?v=' + vid}"
        kw = dict(url=url, title=title, published_at=published, duration_s=dur, metrics=metrics, flags=flags,
                  date_confidence="high")
        existing = M.pub_ids.get(("youtube_short", vid)) or M.pub_ids.get(("youtube", vid))
        if existing:
            c = existing["content"]
            M.attach(c, src, "same YouTube video id (export → Shorts & TikTok)")
            if c["title"].startswith("[sem título]"):
                c["title"] = clean_title(title)
            M._enrich(existing, "published", flags, kw)
            existing["date_confidence"] = "high" if published else existing["date_confidence"]
            continue
        c = date_title_match(title, published) if is_short else None
        if c:
            M.attach(c, src, "same day/month as Para Postar Shorts date + similar title")
            p = next(p for p in c["pubs"] if p["platform"] == "youtube_short" and not p["platform_id"])
            p["platform_id"] = vid
            M.pub_ids[("youtube_short", vid)] = p
            M._enrich(p, "published", flags, kw)
            p["published_at"], p["date_confidence"] = published, "high"
            continue
        c = M.content(src, clean_title(title), status="published", kind="short" if is_short else "long",
                      needs_review=True, cand=True)
        M.pub(c, src, platform, account=yt_acc, status="published", platform_id=vid, **kw)
        M.yt[vid] = c


def clean_title(t):
    return re.sub(r"\s+", " ", re.sub(r"#\w+", "", t)).strip() or t


def date_title_match(title, published):
    """Auto-match a Short only when BOTH a Para Postar Shorts date (same day/month, compatible year)
    and title similarity agree, and exactly one content qualifies."""
    if not published:
        return None
    tg = trigrams(norm_title(title))
    hits = []
    for c in M.contents:
        for p in c["pubs"]:
            if p["platform"] != "youtube_short" or p["platform_id"] or not p["published_at_raw"]:
                continue
            raw_dates = DATE_RE.findall(p["published_at_raw"])
            same = any(int(d) == published.day and int(m) == published.month and
                       (not y or int(y) + (2000 if len(y) == 2 else 0) == published.year) for d, m, y in raw_dates)
            if same and sim(tg, trigrams(norm_title(c["title"]))) >= 0.5:
                hits.append(c)
    return hits[0] if len(hits) == 1 else None


def import_production(ws, kind, cols, start=2, stop=None):
    """Reels / Youtube / production block of Videos Postados YT."""
    for r in rows_of(ws, start, stop):
        if kind == "long" and norm(text(r[0])) not in PRIORITY:
            continue
        src = M.source(ws, r)
        title = text(r[cols["title"]])
        code = None
        for u in urls(r[cols["video"]]):
            if classify(u)[0] == "instagram":
                code = classify(u)[1]
        if code and code in M.ig:
            c = M.ig[code]
            M.attach(c, src, f"same Instagram post ({ws.title} → published)")
        else:
            st = status_of(text(r[cols["status"]]))
            if "status2" in cols and norm(text(r[cols["status2"]])) == "postado":
                st = "published"
            c = M.content(src, title, kind=kind, status=st, cand=True)
        if not c["priority"]:
            c["priority"] = PRIORITY.get(norm(text(r[0])))
        for key, typ in (("video", None), ("final", "final_edit")):
            cl = r[cols[key]]
            lbl = text(cl) if text(cl) and not URL_RE.match(text(cl)) else None
            for u in urls(cl):
                if classify(u)[0] == "instagram":
                    M.pub(c, src, "instagram", account=False, status="published", platform_id=classify(u)[1], url=u)
                else:
                    M.asset(c, src, u, typ=typ, label=lbl)
            if lbl and not urls(cl) and key == "final":
                M.asset(c, src, None, typ="final_edit", label=lbl)
        for key in ("audio", "obs", "ref"):
            if key not in cols:
                continue
            cl = r[cols[key]]
            t = text(cl)
            for u in urls(cl):
                typ = {"audio": "voiceover" if "drive" in u else "audio_ref", "ref": "reference",
                       "obs": "voiceover" if "voice" in norm(t) or "audio" in norm(t) else "other"}[key]
                M.asset(c, src, u, typ=typ)
            rest = URL_RE.sub("", t).strip()
            if rest:
                {"audio": c["audio_notes"], "obs": c["notes"], "ref": c["references_text"]}[key].append(rest)
        if "editor" in cols and text(r[cols["editor"]]):
            c["editor"] = c["editor"] or text(r[cols["editor"]])
        if "status2" in cols and text(r[cols["status2"]]):
            c["notes"].append(f"Status: {text(r[cols['status2']])}")
        if "season" in cols and text(r[cols["season"]]):
            c["season"] = c["season"] or text(r[cols["season"]])


def import_ideas(ws, kind, with_refs):
    for r in rows_of(ws):
        src = M.source(ws, r)
        title = text(r[0])
        link = next(iter(urls(r[1]) + urls(r[0])), None) if with_refs else None
        if link:
            k = classify(link)
            platform = k[0] if k[0] != "asset" else None
            handle = k[2] if k[0] == "tiktok" else None
            i = {"id": str(uuid.uuid4()), "title": title, "url": link, "platform": platform,
                 "creator_handle": handle, "notes": None}
            M.inspirations.append(i)
            src["inspiration_id"] = i["id"]
        else:
            i = {"id": str(uuid.uuid4()), "title": title, "notes": None, "kind": kind}
            M.ideas.append(i)
            src["idea_id"] = i["id"]


# ---------- review candidates ----------
def build_candidates():
    tg = {c["id"]: trigrams(norm_title(c["title"])) for c in M.contents}
    for c in M.contents:
        if not c["cand"] or c["title"].startswith("[sem título]"):
            continue
        scored = []
        for o in M.contents:
            if o is c or (o["cand"] and o["origin"] == c["origin"]):
                continue
            s = sim(tg[c["id"]], tg[o["id"]])
            if s >= CAND_MIN:
                scored.append((s, o))
        for s, o in sorted(scored, key=lambda x: -x[0])[:3]:
            key = tuple(sorted((c["id"], o["id"])))
            if key not in M.cands:
                M.cands[key] = {"a": o, "b": c, "score": round(s, 3), "reason": "título parecido"}
    # exact duplicate titles inside Vídeos Postados that were not merged by Instagram id
    groups = collections.defaultdict(list)
    for c in M.contents:
        if c["origin"] == "Vídeos Postados":
            groups[norm_title(c["title"])].append(c)
    for t, cs in groups.items():
        if len(cs) > 1 and t and t not in GENERIC:
            for o in cs[1:]:
                key = tuple(sorted((cs[0]["id"], o["id"])))
                M.cands.setdefault(key, {"a": cs[0], "b": o, "score": 1.0, "reason": "mesmo título em Vídeos Postados"})


# ---------- output ----------
def write_sql(path):
    tag = "$imp$"
    def j(rows):
        s = json.dumps(rows, ensure_ascii=False, default=str)
        assert tag not in s
        return f"{tag}{s}{tag}::jsonb"
    def nz(lst):
        return "\n".join(lst) or None
    content_rows = [{"id": c["id"], "title": c["title"], "kind": c["kind"], "status": c["status"],
                     "priority": c["priority"], "destination": c["destination"], "topics": c["topics"],
                     "season": c["season"], "notes": nz(c["notes"]), "editor": c["editor"],
                     "audio_notes": nz(c["audio_notes"]), "references_text": nz(c["references_text"]),
                     "needs_review": c["needs_review"], "language": None} for c in M.contents]
    pubs = [{"id": p["id"], "content_id": c["id"], "platform": p["platform"],
             "account_key": p["account"], "status": p["status"], "platform_id": p["platform_id"],
             "url": p["url"], "title": p["title"], "published_at": p["published_at"],
             "published_at_raw": p["published_at_raw"], "date_confidence": p["date_confidence"],
             "posted_by": p["posted_by"], "parts": p["parts"], "duration_s": p["duration_s"],
             "metrics": p["metrics"], "flags": p["flags"], "notes": nz(p["notes"]),
             "source_record_id": p["src"]} for c in M.contents for p in c["pubs"]]
    assets = [{"content_id": c["id"], **{k: a[k] for k in ("type", "url", "label", "note")},
               "source_record_id": a["src"]} for c in M.contents for a in c["assets"]]
    srcs = [{"id": s["id"], "workbook": M.workbook, "sheet": s["sheet"], "row_number": s["row"], "raw": s["raw"],
             "content_id": s["content_id"], "idea_id": s["idea_id"], "inspiration_id": s["inspiration_id"],
             "import_note": s["note"]} for s in M.sources]
    cands = [{"content_a_id": v["a"]["id"], "content_b_id": v["b"]["id"], "score": v["score"],
              "reasons": {"motivo": v["reason"], "a_origem": v["a"]["origin"], "b_origem": v["b"]["origin"]}}
             for v in M.cands.values()]
    chunks = lambda rows, n=300: [rows[i:i + n] for i in range(0, len(rows), n)]
    with open(path, "w", encoding="utf-8") as f:
        f.write("-- Generated by importer/import_workbook.py. Runs in one transaction.\nbegin;\n")
        f.write(f"do $$ begin if exists (select 1 from public.source_record where workbook = {json.dumps(M.workbook).replace(chr(34), chr(39))})"
                " then raise exception 'workbook already imported'; end if; end $$;\n")
        for part in chunks(content_rows):
            f.write("insert into public.content (id,title,kind,status,priority,destination,topics,season,notes,editor,"
                    "audio_notes,references_text,needs_review,language)\nselect * from jsonb_to_recordset("
                    f"{j(part)}) as x(id uuid,title text,kind text,status text,priority text,destination text,"
                    "topics text[],season text,notes text,editor text,audio_notes text,references_text text,"
                    "needs_review boolean,language text);\n")
        for part in chunks(M.ideas):
            f.write("insert into public.idea (id,title,notes,kind) select * from jsonb_to_recordset("
                    f"{j(part)}) as x(id uuid,title text,notes text,kind text);\n")
        for part in chunks(M.inspirations):
            f.write("insert into public.inspiration (id,title,url,platform,creator_handle,notes) select * from "
                    f"jsonb_to_recordset({j(part)}) as x(id uuid,title text,url text,platform text,"
                    "creator_handle text,notes text);\n")
        for part in chunks(srcs, 200):
            f.write("insert into public.source_record (id,workbook,sheet,row_number,raw,content_id,idea_id,"
                    "inspiration_id,import_note) overriding system value select * from jsonb_to_recordset("
                    f"{j(part)}) as x(id bigint,workbook text,sheet text,row_number int,raw jsonb,content_id uuid,"
                    "idea_id uuid,inspiration_id uuid,import_note text);\n")
        f.write("select setval(pg_get_serial_sequence('public.source_record','id'), (select max(id) from public.source_record));\n")
        for part in chunks(pubs):
            f.write("insert into public.publication (id,content_id,platform,account_id,status,platform_id,url,title,"
                    "published_at,published_at_raw,date_confidence,posted_by,parts,duration_s,metrics,flags,notes,"
                    "source_record_id) select x.id,x.content_id,x.platform,a.id,x.status,x.platform_id,x.url,x.title,"
                    "x.published_at,x.published_at_raw,x.date_confidence,x.posted_by,x.parts,x.duration_s,x.metrics,"
                    f"x.flags,x.notes,x.source_record_id from jsonb_to_recordset({j(part)}) as x(id uuid,content_id uuid,"
                    "platform text,account_key text,status text,platform_id text,url text,title text,"
                    "published_at timestamptz,published_at_raw text,date_confidence text,posted_by text,parts int,"
                    "duration_s int,metrics jsonb,flags text[],notes text,source_record_id bigint) "
                    "left join public.account a on a.platform || ':' || a.handle = x.account_key;\n")
        for part in chunks(assets):
            f.write("insert into public.asset (content_id,type,url,label,note,source_record_id) select * from "
                    f"jsonb_to_recordset({j(part)}) as x(content_id uuid,type text,url text,label text,note text,"
                    "source_record_id bigint);\n")
        for part in chunks(cands):
            f.write("insert into public.match_candidate (content_a_id,content_b_id,score,reasons) select * from "
                    f"jsonb_to_recordset({j(part)}) as x(content_a_id uuid,content_b_id uuid,score real,reasons jsonb)"
                    " on conflict do nothing;\n")
        f.write("commit;\n")


def write_report(out):
    pubs = [p for c in M.contents for p in c["pubs"]]
    pc = collections.Counter((p["platform"], p["status"]) for p in pubs)
    lines = ["# Relatório de importação (dry-run)", "",
             f"Planilha: `{M.workbook}` — nada foi gravado no banco.", "",
             "## Linhas lidas (todas preservadas em source_record)", "",
             "| Aba | Linhas |", "|---|---|"]
    lines += [f"| {k} | {v} |" for k, v in M.sheet_rows.items()]
    lines += ["", "## Registros criados", "",
              f"- Conteúdos: **{len(M.contents)}** (marcados para revisão: {sum(c['needs_review'] for c in M.contents)})",
              f"- Publicações: **{len(pubs)}**",
              f"- Assets: **{sum(len(c['assets']) for c in M.contents)}**",
              f"- Ideias: **{len(M.ideas)}** · Inspirações: **{len(M.inspirations)}**",
              f"- Candidatos a duplicata (Revisão): **{len(M.cands)}**", "",
              "## Status de conteúdo", ""]
    lines += [f"- {k}: {v}" for k, v in collections.Counter(c["status"] for c in M.contents).most_common()]
    lines += ["", "## Publicações por plataforma/status", "", "| Plataforma | Status | Qtde |", "|---|---|---|"]
    lines += [f"| {k[0]} | {k[1]} | {v} |" for k, v in sorted(pc.items())]
    lines += ["", "## Associações automáticas (evidência forte)", ""]
    lines += [f"- {k[len('auto-match: '):]}: {v}" for k, v in M.stats.items() if k.startswith("auto-match")]
    lines += ["", "## Datas", ""]
    dc = collections.Counter(p["date_confidence"] for p in pubs if p["published_at_raw"] or p["published_at"])
    lines += [f"- confiança {k}: {v}" for k, v in dc.items()]
    lines += [f"- {k}: {v}" for k, v in M.stats.items() if k.startswith("dates")]
    flags = collections.Counter(f for p in pubs for f in p["flags"])
    lines += ["", "## Sinalizações", ""]
    lines += [f"- publicação `{k}`: {v}" for k, v in flags.most_common()]
    lines += [f"- {k}: {v}" for k, v in M.flags.items()]
    lines += ["", f"## Valores não interpretados: {len(M.unparsed)} (ver unparsed_values.csv; mantidos brutos)", ""]
    with open(os.path.join(out, "report.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")
    with open(os.path.join(out, "review_candidates.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["score", "motivo", "titulo_a", "origem_a", "titulo_b", "origem_b"])
        for v in sorted(M.cands.values(), key=lambda v: -v["score"]):
            w.writerow([v["score"], v["reason"], v["a"]["title"], v["a"]["origin"], v["b"]["title"], v["b"]["origin"]])
    with open(os.path.join(out, "unparsed_values.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["aba", "linha", "coluna", "valor", "tipo"])
        w.writerows(M.unparsed)


def main():
    global M
    ap = argparse.ArgumentParser()
    ap.add_argument("workbook")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__), "out"))
    ap.add_argument("--accounts", help="JSON file {platform:handle: uuid}; default uses deterministic placeholders")
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)
    wb = openpyxl.load_workbook(args.workbook, data_only=True, read_only=False)
    M = Model(os.path.basename(args.workbook))
    M.headers = {ws.title: {c.column_letter: text(c) for c in ws[1]} for ws in wb.worksheets}
    # Accounts are referenced as "platform:handle"; the SQL resolves them to ids at load time.
    for platform, handle in [("instagram", "camilamontreal"), ("instagram", "mundodacami"),
                             ("instagram", "bonjourhicami"), ("tiktok", "camilamontreal"),
                             ("youtube", "camilamontreal")]:
        M.accounts[(platform, handle)] = f"{platform}:{handle}"

    import_videos_postados(wb["Vídeos Postados"])
    import_para_postar(wb["Para Postar (Jack)"])
    import_shorts_tiktok(wb["Shorts & TikTok"])
    import_youtube_export(wb["Videos Postados YT"])
    import_production(wb["Videos Postados YT"], "long",
                      {"title": 1, "video": 2, "status": 3, "obs": 4, "final": 5, "editor": 6, "status2": 7},
                      start=2, stop=18)
    import_production(wb["Youtube"], "long",
                      {"title": 1, "video": 2, "status": 3, "obs": 4, "final": 5, "editor": 6, "status2": 7})
    import_production(wb["Reels"], "short",
                      {"title": 1, "video": 2, "audio": 3, "status": 4, "obs": 5, "ref": 6, "final": 7,
                       "editor": 8, "season": 11})
    import_ideas(wb["Ideias YouTube"], "long", with_refs=False)
    import_ideas(wb["Ideias Reels"], "short", with_refs=True)
    build_candidates()

    # every non-empty row of every sheet must be in source_record
    for ws in wb.worksheets:
        seen = {s["row"] for s in M.sources if s["sheet"] == ws.title}
        for r in rows_of(ws, start=2):
            if r[0].row not in seen:
                M.source(ws, r, note="linha não mapeada para entidade (preservada)")
                M.flags[f"{ws.title}: linhas preservadas sem entidade"] += 1

    write_sql(os.path.join(args.out, "import.sql"))
    write_report(args.out)
    print(open(os.path.join(args.out, "report.md"), encoding="utf-8").read())


if __name__ == "__main__":
    main()
