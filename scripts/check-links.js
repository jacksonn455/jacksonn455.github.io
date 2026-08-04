#!/usr/bin/env node
/* Verifica que todo href/src local do index.html existe em disco,
   que as chaves data-i18n existem nos bundles e que os bundles estao alinhados. */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

let errors = 0;
const fail = (msg) => {
  console.error('  ✗ ' + msg);
  errors++;
};

/* ---- 0. sintaxe do JavaScript ----
   Um unico erro de sintaxe em app.js derruba a pagina inteira em silencio:
   nada de tema, idioma, accordion ou lightbox. Barato de checar, caro de nao checar. */
{
  const { execFileSync } = require('child_process');
  const jsFiles = [
    'assets/js/app.js',
    ...fs.readdirSync(path.join(ROOT, 'scripts')).map((f) => `scripts/${f}`),
  ].filter((f) => f.endsWith('.js'));

  for (const rel of jsFiles) {
    try {
      execFileSync(process.execPath, ['--check', path.join(ROOT, rel)], { stdio: 'pipe' });
    } catch (err) {
      const msg = String(err.stderr || err.message)
        .split('\n')
        .slice(0, 3)
        .join(' ')
        .trim();
      fail(`erro de sintaxe em ${rel}: ${msg}`);
    }
  }
  console.log(`Arquivos JS verificados: ${jsFiles.length}`);
}

/* ---- 1. assets locais ---- */
const assets = new Set(
  [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
    .map((m) => m[1].trim())
    .filter((u) => u && !/^(https?:|mailto:|tel:|#|data:)/.test(u)),
);
console.log(`Assets locais referenciados: ${assets.size}`);
for (const rel of assets) {
  const file = path.join(ROOT, decodeURI(rel.split('?')[0].split('#')[0]));
  if (!fs.existsSync(file)) fail(`asset inexistente: ${rel}`);
}

/* ---- 2. chaves i18n ---- */
const langs = ['en', 'pt', 'es'];
const bundles = Object.fromEntries(
  langs.map((l) => [
    l,
    JSON.parse(fs.readFileSync(path.join(ROOT, `assets/i18n/${l}.json`), 'utf8')),
  ]),
);

const get = (dict, key) => key.split('.').reduce((a, p) => (a == null ? a : a[p]), dict);

const usedKeys = new Set([
  ...[...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)]
    .flatMap((m) => m[1].split(','))
    .map((pair) => pair.split(':')[1]?.trim())
    .filter(Boolean),
]);
console.log(`Chaves data-i18n usadas: ${usedKeys.size}`);

for (const key of usedKeys) {
  if (get(bundles.en, key) == null) fail(`chave ausente em en.json: ${key}`);
}

/* ---- 3. paridade entre bundles ---- */
const flat = (o, prefix = '') =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? flat(v, prefix + k + '.') : [prefix + k],
  );
const enKeys = new Set(flat(bundles.en));
for (const lang of ['pt', 'es']) {
  const missing = [...enKeys].filter((k) => get(bundles[lang], k) == null);
  if (missing.length)
    fail(
      `${lang}.json sem ${missing.length} chaves: ${missing.slice(0, 6).join(', ')}${missing.length > 6 ? '…' : ''}`,
    );
}

/* ---- 4. higiene de acessibilidade / seguranca ---- */
const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
const noAlt = imgs.filter((t) => !/\balt=/.test(t));
if (noAlt.length) fail(`${noAlt.length} <img> sem alt`);

// a <img> do lightbox e preenchida em runtime; suas dimensoes variam por imagem
const staticImgs = imgs.filter((t) => !/data-lightbox-img/.test(t));
const noDims = staticImgs.filter((t) => !/\bwidth=/.test(t) || !/\bheight=/.test(t));
if (noDims.length) fail(`${noDims.length} <img> sem width/height`);

const blankNoRel = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)]
  .map((m) => m[0])
  .filter((t) => !/rel="[^"]*noopener/.test(t));
if (blankNoRel.length) fail(`${blankNoRel.length} link(s) target=_blank sem rel=noopener`);

const h1 = (html.match(/<h1\b/g) || []).length;
if (h1 !== 1) fail(`esperado exatamente 1 <h1>, encontrado ${h1}`);

/* ---- 5. sem dependencias externas em tempo de carregamento ---- */
// canonical/hreflang/og apontam para fora por definicao e nao sao subrecursos
const externalSubresources = [
  ...[...html.matchAll(/<script\b[^>]*\bsrc="(https?:\/\/[^"]+)"/g)].map((m) => m[1]),
  ...[...html.matchAll(/<link\b[^>]*>/g)]
    .filter((m) => /rel="(stylesheet|preload|preconnect|dns-prefetch|modulepreload)"/.test(m[0]))
    .map((m) => (m[0].match(/href="(https?:\/\/[^"]+)"/) || [])[1])
    .filter(Boolean),
];
if (externalSubresources.length) {
  fail(`subrecursos externos no carregamento: ${externalSubresources.join(', ')}`);
}

console.log(errors ? `\n${errors} problema(s) encontrado(s).` : '\nTudo certo.');
process.exit(errors ? 1 : 0);
