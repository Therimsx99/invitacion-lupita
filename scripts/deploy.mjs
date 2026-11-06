// Construye el sitio y publica dist/ en la rama gh-pages.
import { execSync } from 'node:child_process';
import { mkdtempSync, cpSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (c, o = {}) => execSync(c, { stdio: 'inherit', ...o });
run('npm run build');
if (!existsSync('dist')) throw new Error('No existe dist/');

const remote = execSync('git remote get-url origin').toString().trim();
const tmp = mkdtempSync(join(tmpdir(), 'ghp-'));
cpSync('dist', tmp, { recursive: true });
run('git init -q -b gh-pages', { cwd: tmp });
run('git add -A', { cwd: tmp });
run('git commit -q -m "Deploy"', { cwd: tmp });
run(`git push -f ${remote} gh-pages`, { cwd: tmp });
rmSync(tmp, { recursive: true, force: true });
