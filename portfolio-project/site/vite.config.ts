import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// PREVIEW=1 gera um único index.html com tudo inline (para prévias/compartilhar).
// Sem PREVIEW, build normal (dist/ com assets separados) para publicar em qualquer hospedagem.
// BASE=/portfolio/ muda o caminho base quando o site vai numa subpasta do domínio.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react(), ...(process.env.PREVIEW ? [viteSingleFile()] : [])],
  build: { chunkSizeWarningLimit: 900 },
})
