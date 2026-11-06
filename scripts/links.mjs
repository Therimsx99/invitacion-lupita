// Imprime los links completos de todos los invitados.
// Uso:  SITE_URL=https://therimsx99.github.io/invitacion-lupita npm run links
import { readFileSync } from 'node:fs';

const site = (process.env.SITE_URL || 'https://therimsx99.github.io/invitacion-lupita').replace(/\/+$/, '');
const invitados = JSON.parse(readFileSync(new URL('../src/data/invitados.json', import.meta.url), 'utf8'));

for (const i of invitados) {
  const pases = [i.adultos && `${i.adultos} ad.`, i.ninos && `${i.ninos} ni.`].filter(Boolean).join(' + ');
  console.log(`${i.nombre} (${pases})\n${site}/${i.slug}\n`);
}
console.log(`Total: ${invitados.length} invitaciones`);
