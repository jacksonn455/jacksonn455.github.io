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
 * O card da home usa a foto assets/_src/perfil-02.png como fundo: a pessoa
 * ocupa a esquerda e a parede vazia da direita recebe o texto sobre um scrim
 * escuro. As fontes ficam em assets/_src (fora do walk do npm run images).
 *
 *   npm run og
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'assets/social');
const SRC = path.join(ROOT, 'assets/_src');

const W = 1200;
const H = 630;
const FONT = 'Segoe UI, Noto Sans, DejaVu Sans, Arial, Helvetica, sans-serif';

/* Um card por idioma/contexto: a home compartilha em ingles (og:locale en_US),
   /cursos e /afiliados compartilham em portugues. */
const CARDS = [
  {
    file: 'og-cover.png',
    photo: 'perfil-02.png',
    /* O painel de texto ocupa so a parede vazia da direita, entao title,
       subtitle e tech quebram em linhas curtas em vez de uma linha longa. */
    titleLines: ['Jackson F.', 'Magnabosco'],
    subtitleLines: ['Senior Software Engineer', '&amp; Professor'],
    techLines: ['Node.js  ·  TypeScript', 'Java  ·  AWS  ·  Microservices'],
    footerStrong: '9 online technology courses',
    footerMutedLines: ['400+ students in 25 countries', 'Udemy and Hotmart'],
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

/* Variante sobre foto: scrim escuro cobrindo a metade direita (a parede vazia)
   e o mesmo conteudo do card de texto, so que em coluna estreita. X = 660
   mantem o rosto, que termina por volta de x = 490, totalmente livre. */
const X = 660;

const photoCard = (
  c,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
      <stop offset="30%" stop-color="#0d1117" stop-opacity="0"/>
      <stop offset="52%" stop-color="#0d1117" stop-opacity="0.88"/>
      <stop offset="100%" stop-color="#0d1117" stop-opacity="0.96"/>
    </linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff6600"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect width="${W}" height="8" fill="url(#bar)"/>

  <g font-family="${FONT}">
    <text x="${X}" y="104" fill="#ff8a3d" font-size="18" font-weight="600" letter-spacing="2.5">JACKSONMAGNABOSCO.DEV</text>

    <text x="${X}" y="192" fill="#ffffff" font-size="56" font-weight="700">${c.titleLines[0]}</text>
    <text x="${X}" y="254" fill="#ffffff" font-size="56" font-weight="700">${c.titleLines[1]}</text>

    <text x="${X}" y="312" fill="#e6edf3" font-size="28" font-weight="600">${c.subtitleLines[0]}</text>
    <text x="${X}" y="348" fill="#e6edf3" font-size="28" font-weight="600">${c.subtitleLines[1]}</text>

    <text x="${X}" y="400" fill="#9aa4b2" font-size="22" font-weight="400">${c.techLines[0]}</text>
    <text x="${X}" y="430" fill="#9aa4b2" font-size="22" font-weight="400">${c.techLines[1]}</text>

    <rect x="${X}" y="470" width="80" height="4" fill="#ff6600"/>

    <text x="${X}" y="522" fill="#ffffff" font-size="24" font-weight="600">${c.footerStrong}</text>
    <text x="${X}" y="556" fill="#9aa4b2" font-size="20" font-weight="400">${c.footerMutedLines[0]}</text>
    <text x="${X}" y="584" fill="#9aa4b2" font-size="20" font-weight="400">${c.footerMutedLines[1]}</text>
  </g>
</svg>`;

const render = async (c) => {
  if (!c.photo) return sharp(Buffer.from(card(c)));

  const photo = path.join(SRC, c.photo);
  if (!fs.existsSync(photo)) {
    throw new Error(`${c.file}: foto de origem ausente em ${path.relative(ROOT, photo)}`);
  }
  /* cover em vez de resize simples: a origem e 1729x910 (1.900) contra os
     1.905 do alvo, entao sobra so uma fatia de ~2px de altura para aparar. */
  const base = await sharp(photo).resize(W, H, { fit: 'cover', position: 'centre' }).toBuffer();
  return sharp(base).composite([{ input: Buffer.from(photoCard(c)) }]);
};

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  for (const c of CARDS) {
    const out = path.join(DIR, c.file);
    /* Foto em PNG truecolor da ~1 MB e o WhatsApp descarta og:image acima de
       ~300 KB. A paleta derruba para ~200 KB sem banding perceptivel; nos
       cards so de texto ela fica de fora, porque o gradiente do fundo e
       justamente onde a quantizacao apareceria. */
    const encode = c.photo ? { palette: true, quality: 100, effort: 10 } : {};
    const buffer = await (await render(c)).png({ compressionLevel: 9, ...encode }).toBuffer();
    fs.writeFileSync(out, buffer);
    const meta = await sharp(buffer).metadata();
    console.log(
      `assets/social/${c.file}  ${meta.width}x${meta.height}  ${(buffer.length / 1024).toFixed(0)} KB`,
    );
  }
})();
