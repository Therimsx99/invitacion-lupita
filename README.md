# Invitaciones – 75 años de Lupita

Sitio estático (Astro + Tailwind + GSAP). Una página por invitado desde `src/data/invitados.json`.

- `npm run dev` – desarrollo
- `npm run build` – genera `dist/`
- `npm run links` – imprime los links de todos los invitados (usa `SITE_URL`)
- `npm run deploy` – construye y publica `dist/` en la rama `gh-pages`
- Música: pon tu archivo en `public/musica.mp3` (el botón aparece solo si el archivo existe).
- `SITE_URL` define dominio y subruta, p. ej. `SITE_URL=https://midominio.com npm run build` (Vercel: variable de entorno).
- `python scripts/make-assets.py` regenera las flores PNG y `og.jpg` desde `design/invitacion.png`.
