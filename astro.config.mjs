import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL = URL completa donde vive el sitio (incluye subruta en GitHub Pages)
const SITE_URL = (process.env.SITE_URL || 'https://therimsx99.github.io/invitacion-lupita').replace(/\/+$/, '');
const u = new URL(SITE_URL);

export default defineConfig({
  site: u.origin,
  base: u.pathname === '/' ? '/' : u.pathname,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: { plugins: [tailwindcss()] },
});
