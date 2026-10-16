/** Projeção do mapa de rotas: plana (equiretangular), ajustada aos pontos. Sem serviço externo. */
export type Pt = { x: number; y: number }
export type View = { project: (lon: number, lat: number) => Pt; lonRange: [number, number]; latRange: [number, number] }

export function fitView(points: { lon: number; lat: number }[], world = false, MAP_W = 1000, MAP_H = 600): View {
  let lon0 = -180, lon1 = 180, lat0 = -60, lat1 = 80
  if (!world && points.length) {
    const lons = points.map((p) => p.lon), lats = points.map((p) => p.lat)
    lon0 = Math.min(...lons); lon1 = Math.max(...lons); lat0 = Math.min(...lats); lat1 = Math.max(...lats)
    const padLon = Math.max(8, (lon1 - lon0) * 0.18), padLat = Math.max(6, (lat1 - lat0) * 0.25)
    lon0 -= padLon; lon1 += padLon; lat0 -= padLat; lat1 += padLat
  }
  const midLat = (lat0 + lat1) / 2
  const kx = Math.cos((midLat * Math.PI) / 180)
  // px por grau: o menor que cabe nos dois eixos; centraliza o resto
  const s = Math.min(MAP_W / ((lon1 - lon0) * kx), MAP_H / (lat1 - lat0))
  const ox = (MAP_W - (lon1 - lon0) * kx * s) / 2, oy = (MAP_H - (lat1 - lat0) * s) / 2
  const project = (lon: number, lat: number): Pt => ({ x: ox + (lon - lon0) * kx * s, y: oy + (lat1 - lat) * s })
  const lonSpan = MAP_W / (kx * s), latSpan = MAP_H / s
  const cLon = (lon0 + lon1) / 2, cLat = midLat
  return { project, lonRange: [cLon - lonSpan / 2, cLon + lonSpan / 2], latRange: [cLat - latSpan / 2, cLat + latSpan / 2] }
}

/** Arco de voo: curva quadrática levantada para cima, como nos mapas de companhias aéreas. */
export function arc(a: Pt, b: Pt): string {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
  const d = Math.hypot(b.x - a.x, b.y - a.y)
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${(my - d * 0.28).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

/** Passo da grade (graus) conforme o zoom. */
export const gridStep = (span: number) => (span > 120 ? 30 : span > 50 ? 10 : 5)
