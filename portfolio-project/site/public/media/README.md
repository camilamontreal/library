# Mídias

Coloque aqui as fotos e vídeos. Os caminhos esperados estão nos JSON de `src/content/`; `npm run check-content` lista exatamente o que falta.

```
media/
├── profile/avatar.jpg               quadrada ≥ 1200 px
├── wallpapers/{morning,afternoon,evening,night}.jpg   horizontais ≥ 2400 px (ou .mp4 + poster)
├── wallpapers/lockscreen.jpg        vertical ≥ 1200×2200
├── projects/<id>/cover.jpg          horizontal 16:9 ou 3:2
├── projects/<id>/01.mp4 + 01.jpg    vídeos verticais 9:16 curtos (≤ 10 s, mudos) com poster
├── networks/instagram/01..12.jpg    quadradas
├── networks/tiktok/01..12.(mp4|jpg) verticais
├── networks/youtube/01..06.jpg      16:9
├── networks/site/*.jpg              16:9
├── education/*.jpg                  certificados (opcional)
└── brands/*.svg|png                 logos (opcional)
```

Formatos: JPG/WebP (≤ 400 KB), MP4 H.264 (≤ 4 MB). Créditos de imagens que não são da Cami vão em `CREDITOS.md` e no campo `credit` do JSON.
