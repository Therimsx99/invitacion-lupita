import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Hojas / pétalos flotando ---------- */
function petals() {
  const host = $('#petals');
  if (!host || reduce) return;
  const colors = ['#cdbba2', '#b6a088', '#e6d6bf', '#a99a80', '#d9c3ac'];
  const N = window.innerWidth < 600 ? 12 : 18;
  for (let i = 0; i < N; i++) {
    const s = 12 + Math.random() * 14;
    const leaf = Math.random() > 0.45;
    const el = document.createElement('div');
    el.style.cssText = `position:absolute;top:0;left:0;width:${s}px;height:${s * (leaf ? 1.7 : 1.2)}px;opacity:0;will-change:transform`;
    el.innerHTML = leaf
      ? `<svg viewBox="0 0 10 17" width="100%" height="100%"><path d="M5 0C9 4 9.5 11 5 17 .5 11 1 4 5 0z" fill="${colors[i % 5]}"/><path d="M5 2v13" stroke="#fff" stroke-opacity=".35" stroke-width=".4"/></svg>`
      : `<svg viewBox="0 0 12 14" width="100%" height="100%"><path d="M6 0C11 3 12 9 6 14 0 9 1 3 6 0z" fill="${colors[i % 5]}"/></svg>`;
    host.appendChild(el);
    const W = window.innerWidth;
    const H = window.innerHeight;
    const startX = Math.random() * W;
    gsap.set(el, { x: startX, y: -40 - Math.random() * H, rotation: Math.random() * 360 });
    const fall = () => {
      const dur = 16 + Math.random() * 14;
      gsap.fromTo(el, { y: -40, x: Math.random() * W, opacity: 0 }, {
        y: H + 40, duration: dur, ease: 'none', onComplete: fall,
      });
      gsap.to(el, { opacity: 0.5, duration: 2, delay: 0.2, ease: 'sine.out' });
      gsap.to(el, { x: '+=' + (Math.random() > 0.5 ? 70 : -70), duration: 4 + Math.random() * 3, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(dur / 6) });
      gsap.to(el, { rotation: '+=' + (Math.random() > 0.5 ? 200 : -200), duration: dur, ease: 'none' });
    };
    gsap.delayedCall(Math.random() * 8, fall);
  }
}

/* ---------- Flores con balanceo sutil ---------- */
function sway() {
  if (reduce) return;
  $$('[data-sway]').forEach((el, i) => {
    gsap.to(el, { rotation: i ? -1.6 : 1.6, duration: 5 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  });
}

/* ---------- Música ---------- */
function music() {
  const audio = $<HTMLAudioElement>('#bgm');
  const btn = $<HTMLButtonElement>('#music');
  if (!audio || !btn) return;
  const show = () => { btn.hidden = false; };
  audio.addEventListener('loadedmetadata', show);
  if (audio.readyState >= 1) show();
  const sync = () => {
    const playing = !audio.paused;
    btn.setAttribute('aria-pressed', String(playing));
    btn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    btn.querySelector('.icon-play')?.classList.toggle('hidden', playing);
    btn.querySelector('.icon-pause')?.classList.toggle('hidden', !playing);
  };
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  btn.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
}

/* ---------- Cuenta regresiva ---------- */
function countdown() {
  const box = $('#countdown');
  if (!box) return;
  const target = Date.parse(box.dataset.target || '');
  const cells = Object.fromEntries($$('[data-cd]').map((e) => [e.dataset.cd!, e]));
  const pad = (n: number) => String(n).padStart(2, '0');
  const tick = () => {
    let diff = target - Date.now();
    if (diff <= 0) {
      box.classList.add('hidden');
      $('#cdDone')?.classList.remove('hidden');
      return false;
    }
    const s = Math.floor(diff / 1000);
    cells.d.textContent = String(Math.floor(s / 86400));
    cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
    cells.m.textContent = pad(Math.floor((s % 3600) / 60));
    cells.s.textContent = pad(s % 60);
    return true;
  };
  if (tick()) setInterval(tick, 1000);
}

/* ---------- Aparición al hacer scroll + iconos animados ---------- */
function reveals() {
  $$('[data-reveal]').forEach((el) => {
    if (reduce) { gsap.set(el, { opacity: 1 }); return; }
    gsap.fromTo(el, { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  const church = $<SVGElement>('#iconChurch');
  if (church) {
    const paths = Array.from(church.querySelectorAll<SVGGeometryElement>('path,circle'));
    if (!reduce) {
      gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
      ScrollTrigger.create({
        trigger: church, start: 'top 88%', once: true,
        onEnter: () => {
          gsap.to(paths, { strokeDashoffset: 0, duration: 1.4, stagger: 0.25, ease: 'power1.inOut' });
          gsap.fromTo(church, { y: 4 }, { y: -3, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.6 });
        },
      });
    }
  }

  const gl = $<SVGElement>('#iconGlasses');
  if (gl && !reduce) {
    const L = gl.querySelector('#glassL .gl');
    const R = gl.querySelector('#glassR .gl');
    const sp = gl.querySelectorAll('.spark path');
    gsap.set(L, { rotation: -12, transformOrigin: '50% 100%' });
    gsap.set(R, { rotation: 12, transformOrigin: '50% 100%' });
    gsap.set(sp, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
    ScrollTrigger.create({
      trigger: gl, start: 'top 88%', once: true,
      onEnter: () => {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.2, delay: 0.4 });
        tl.to(L, { rotation: 14, duration: 0.5, ease: 'power2.in' }, 0)
          .to(R, { rotation: -14, duration: 0.5, ease: 'power2.in' }, 0)
          .to(sp, { opacity: 1, scale: 1, duration: 0.35, stagger: 0.08, ease: 'back.out(3)' }, 0.5)
          .to(L, { rotation: 4, duration: 0.5, ease: 'power2.out' }, 0.7)
          .to(R, { rotation: -4, duration: 0.5, ease: 'power2.out' }, 0.7)
          .to(sp, { opacity: 0, scale: 0.4, duration: 0.5, stagger: 0.05 }, 1.3)
          .to(L, { rotation: -12, duration: 0.7, ease: 'sine.inOut' }, 1.5)
          .to(R, { rotation: 12, duration: 0.7, ease: 'sine.inOut' }, 1.5);
      },
    });
  }
}

/* ---------- Hero: 75 contando + Lupita escrita a mano ---------- */
function startHero() {
  const hero = $$('[data-hero]');
  const num = $('#count75');
  const wipe = $('#wipeRect');
  const stroke = $('#lupitaStroke');
  const fill = $('#lupitaFill');
  if (!hero.length) return;

  if (reduce) {
    gsap.set(hero, { opacity: 1 });
    gsap.set(fill, { opacity: 1 });
    gsap.set(wipe, { attr: { width: 700 } });
    return;
  }
  const [intro, big, anos, orn] = hero;
  const obj = { v: 0 };
  const tl = gsap.timeline();
  tl.fromTo(intro, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
    .fromTo(big, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.9, ease: 'power2.out' }, 0.4)
    .to(obj, { v: 75, duration: 2.4, ease: 'power2.out', onUpdate: () => { if (num) num.textContent = String(Math.round(obj.v)); } }, 0.5)
    .fromTo(anos, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 2.6)
    .to(wipe, { attr: { width: 700 }, duration: 3.2, ease: 'power1.inOut' }, 3.0)
    .to(stroke, { strokeDashoffset: 0, duration: 3.0, ease: 'power1.inOut' }, 3.0)
    .to(fill, { opacity: 1, duration: 1.1, ease: 'power1.out' }, 5.4)
    .to(stroke, { opacity: 0, duration: 1.1 }, 5.8)
    .fromTo(orn, { opacity: 0 }, { opacity: 1, duration: 1 }, 5.8);
}

/* ---------- Sobre de entrada ---------- */
function gate() {
  const g = $('#gate');
  const hasGate = document.body.dataset.gate === '1';
  if (!g || !hasGate) { startHero(); return; }

  const num = $('#count75');
  if (num) num.textContent = '0';
  gsap.set($$('[data-hero]'), { opacity: 0 });

  const open = $('#envelope')!;
  let opened = false;
  const finish = () => {
    document.body.classList.remove('locked');
    g.style.display = 'none';
  };
  open.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    window.scrollTo(0, 0);
    // El toque en el sobre cuenta como gesto del usuario: el navegador permite iniciar la música.
    $<HTMLAudioElement>('#bgm')?.play().catch(() => {});
    if (reduce) { finish(); startHero(); return; }
    const tl = gsap.timeline({ onComplete: finish });
    tl.to('#seal', { scale: 0.6, opacity: 0, duration: 0.3, ease: 'power2.in' })
      .to('#tapHint', { opacity: 0, duration: 0.2 }, 0)
      .to('#flap', { rotationX: -180, transformPerspective: 900, transformOrigin: '50% 0%', duration: 0.65, ease: 'power2.inOut' }, 0.2)
      .set('#flap', { opacity: 0 }, 0.5)
      .to('#letter', { yPercent: -58, duration: 0.7, ease: 'power2.out' }, 0.7)
      .to('#gateBox', { scale: 1.5, duration: 0.8, ease: 'power2.in' }, 1.4)
      .to(g, { opacity: 0, duration: 0.7, ease: 'power1.inOut' }, 1.6)
      .add(() => { document.body.classList.remove('locked'); startHero(); }, 1.7);
  });
}

try {
  petals();
  sway();
  music();
  countdown();
  reveals();
  gate();
} catch (e) {
  console.error(e);
  document.getElementById('gate')?.remove();
  document.body.classList.remove('locked');
  $$('[data-hero],[data-reveal]').forEach((el) => (el.style.opacity = '1'));
}
