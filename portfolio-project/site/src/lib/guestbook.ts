import { content } from '../content'
import type { Lang } from './i18n'

/**
 * Livro de visitas (app Notas).
 * - Com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY definidos, os recados ficam num banco público (ver supabase/guestbook.sql).
 * - Sem elas, funciona em "modo prévia": os recados ficam só no navegador de quem escreveu.
 * Os recados aparecem na hora (sem aprovação); para esconder um, marque `hidden = true` no painel do Supabase.
 */
const URL_BASE = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '')
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
export const guestbookLive = Boolean(URL_BASE && ANON)

export const LIMITS = { name: 40, message: 280, minMessage: 2, cooldownMs: 60_000 }
export type Note = { id: string; name: string; message: string; createdAt: string }
export type NoteCheck = { ok: true; name: string; message: string } | { ok: false; reason: 'short' | 'links' }

const clean = (s: string) => s.replace(/\s+/g, ' ').trim()
const LINK = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|xyz|info|biz|co|me|ly|link|site|online)\b)/i
const REPEAT = /(.)\1{9,}/

/** Regras de spam do lado do navegador (o banco repete as mesmas por segurança). */
export function checkNote(rawName: string, rawMessage: string): NoteCheck {
  const name = clean(rawName).slice(0, LIMITS.name)
  const message = clean(rawMessage).slice(0, LIMITS.message)
  if (!name || message.length < LIMITS.minMessage || REPEAT.test(message)) return { ok: false, reason: 'short' }
  if (LINK.test(message) || LINK.test(name)) return { ok: false, reason: 'links' }
  return { ok: true, name, message }
}

const LOCAL_KEY = 'camios.notes', LAST_KEY = 'camios.notes.last'
const readLocal = (): Note[] => { try { return JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') } catch { return [] } }

export async function fetchNotes(): Promise<Note[]> {
  if (!guestbookLive) return readLocal()
  const r = await fetch(`${URL_BASE}/rest/v1/guestbook?select=id,name,message,created_at&order=created_at.desc&limit=100`, { headers: { apikey: ANON!, Authorization: `Bearer ${ANON}` } })
  if (!r.ok) throw new Error(String(r.status))
  const rows = (await r.json()) as { id: string; name: string; message: string; created_at: string }[]
  return rows.map((x) => ({ id: x.id, name: x.name, message: x.message, createdAt: x.created_at }))
}

export type PostResult = { ok: true; note: Note } | { ok: false; reason: 'short' | 'links' | 'wait' | 'error' }

export async function postNote(rawName: string, rawMessage: string, lang: Lang, honeypot = ''): Promise<PostResult> {
  if (honeypot) return { ok: false, reason: 'error' } // robôs preenchem o campo escondido
  const c = checkNote(rawName, rawMessage)
  if (!c.ok) return c
  try { if (Date.now() - Number(localStorage.getItem(LAST_KEY) ?? 0) < LIMITS.cooldownMs) return { ok: false, reason: 'wait' } } catch { /* */ }
  const note: Note = { id: `local-${Date.now()}`, name: c.name, message: c.message, createdAt: new Date().toISOString() }
  if (guestbookLive) {
    const r = await fetch(`${URL_BASE}/rest/v1/guestbook`, {
      method: 'POST',
      headers: { apikey: ANON!, Authorization: `Bearer ${ANON}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ name: c.name, message: c.message, lang }),
    }).catch(() => null)
    if (!r || !r.ok) return { ok: false, reason: 'error' }
  } else {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify([note, ...readLocal()].slice(0, 50))) } catch { /* */ }
  }
  try { localStorage.setItem(LAST_KEY, String(Date.now())) } catch { /* */ }
  return { ok: true, note }
}

/** Nota fixa da Cami (texto vem de guestbook.json). */
export const welcomeNote = () => ({ title: content.guestbook.welcomeTitle, body: content.guestbook.welcomeBody })
