#!/usr/bin/env node
/*
 * Gera a imagem de compartilhamento social (Open Graph / Twitter Card) em
 * 1200x630 — a proporcao que Facebook, LinkedIn, WhatsApp, X, Slack e as
 * previews dos buscadores de IA esperam.
 *
 * Antes disso o site compartilhava assets/img/perfil.webp (555x394): abaixo do
 * minimo de 1200x630, o que faz as plataformas cairem no card pequeno, sem
 * imagem grande, e derruba o CTR do link.
 *
 * Fica fora de assets/img de proposito: o npm run images reencoda aquele
 * diretorio inteiro para WebP e apagaria o PNG, que e o formato com melhor
 * compatibilidade entre as plataformas sociais.
 *
 *   npm run og
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'assets/social');

const W = 1200;
const H = 630;
const FONT = 'Segoe UI, Noto Sans, DejaVu Sans, Arial, Helvetica, sans-serif';

/* Um card por idioma/contexto: a home compartilha em ingles (og:locale en_US),
   /cursos e /afiliados compartilham em portugues. */
const CARDS = [
  {
    file: 'og-cover.png',
    title: 'Jackson F. Magnabosco',
    subtitle: 'Senior Software Engineer &amp; Professor',
    tech: 'Node.js  ·  TypeScript  ·  Java  ·  AWS  ·  Microservices',
    footerStrong: '9 online technology courses',
    footerMuted: '400+ students in 25 countries  ·  Udemy and Hotmart',
  },
  {
    file: 'og-cursos.png',
    title: 'Cursos de tecnologia',
    subtitle: 'com Jackson F. Magnabosco',
    tech: 'Programação  ·  Dados  ·  Interfaces  ·  IoT  ·  IA  ·  Carreira',
    footerStrong: '9 cursos online em português',
    footerMuted: 'Udemy e Hotmart  ·  40% de comissão para afiliados',
  },
];

const card = (
  c,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="14%" cy="8%" r="78%">
      <stop offset="0%" stop-color="#ff6600" stop-opacity="0.42"/>
      <stop offset="55%" stop-color="#ff6600" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#ff6600" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff6600"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0d1117"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="8" fill="url(#bar)"/>

  <g font-family="${FONT}">
    <text x="80" y="140" fill="#ff8a3d" font-size="25" font-weight="600" letter-spacing="3.5">JACKSONMAGNABOSCO.DEV</text>

    <text x="80" y="248" fill="#ffffff" font-size="78" font-weight="700">${c.title}</text>

    <text x="80" y="322" fill="#e6edf3" font-size="40" font-weight="600">${c.subtitle}</text>

    <text x="80" y="392" fill="#9aa4b2" font-size="29" font-weight="400">${c.tech}</text>

    <rect x="80" y="446" width="112" height="4" fill="#ff6600"/>

    <text x="80" y="524" fill="#ffffff" font-size="31" font-weight="600">${c.footerStrong}</text>
    <text x="80" y="570" fill="#9aa4b2" font-size="27" font-weight="400">${c.footerMuted}</text>
  </g>
</svg>`;

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  for (const c of CARDS) {
    const out = path.join(DIR, c.file);
    const buffer = await sharp(Buffer.from(card(c)))
      .png({ compressionLevel: 9 })
      .toBuffer();
    fs.writeFileSync(out, buffer);
    const meta = await sharp(buffer).metadata();
    console.log(
      `assets/social/${c.file}  ${meta.width}x${meta.height}  ${(buffer.length / 1024).toFixed(0)} KB`,
    );
  }
})();
