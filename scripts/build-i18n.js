#!/usr/bin/env node
/*
 * Torna index.html autossuficiente:
 *
 *  1. Preenche todo [data-i18n] / [data-i18n-attr] com o texto de en.json.
 *     A pagina passa a renderizar completa sem JavaScript - nada de secoes
 *     vazias se o script falhar, e os buscadores veem o conteudo real.
 *
 *  2. Embute pt.json e es.json em <script type="application/json">.
 *     Sem fetch, a troca de idioma funciona em file://, offline e sob CSP
 *     restritiva. O ingles nao e embutido: ja esta no HTML.
 *
 * Idempotente - pode rodar quantas vezes quiser.  npm run build
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'index.html');
const START = '<!-- i18n:bundles:start -->';
const END = '<!-- i18n:bundles:end -->';

const read = (lang) =>
  JSON.parse(fs.readFileSync(path.join(ROOT, `assets/i18n/${lang}.json`), 'utf8'));

const get = (dict, key) => key.split('.').reduce((a, p) => (a == null ? a : a[p]), dict);

const en = read('en');
let source = fs.readFileSync(HTML, 'utf8');

/* ---------- 1. conteudo em ingles direto no HTML ---------- */
const dom = new JSDOM(source);
const D = dom.window.document;

let filled = 0;
let missing = [];

D.querySelectorAll('[data-i18n]').forEach((el) => {
  const key = el.getAttribute('data-i18n');
  const value = get(en, key);
  if (value == null) {
    missing.push(key);
    return;
  }
  if (el.innerHTML !== value) {
    el.innerHTML = value;
    filled++;
  }
});

D.querySelectorAll('[data-i18n-attr]').forEach((el) => {
  el.getAttribute('data-i18n-attr')
    .split(',')
    .forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (!attr || !key) return;
      const value = get(en, key);
      if (value == null) {
        missing.push(key);
        return;
      }
      if (el.getAttribute(attr) !== value) {
        el.setAttribute(attr, value);
        filled++;
      }
    });
});

// title e meta description tambem sao traduziveis
if (en.metaTitle) D.title = en.metaTitle;
const descEl = D.querySelector('meta[name="description"]');
if (descEl && en.metaDescription) descEl.setAttribute('content', en.metaDescription);

// os papeis da maquina de escrever nao pertencem a nenhum elemento de texto:
// guarda o valor em ingles no proprio atributo, que serve de fallback
const typer = D.querySelector('[data-typewriter]');
if (typer && en.heroRoles) {
  typer.setAttribute('data-typewriter', en.heroRoles);
  filled++;
}

// nada mais e buscado por fetch: o preload do bundle en ficou obsoleto
D.querySelectorAll('link[rel="preload"][href*="i18n"]').forEach((l) => l.remove());

/* O jsdom reserializa atributos booleanos como `defer=""`. Normalizar devolve
   o estilo canonico, mantem o html-validate satisfeito e torna o build
   idempotente (rodar duas vezes produz bytes identicos). */
const BOOLEAN_ATTRS = [
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'download',
  'formnovalidate',
  'hidden',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
];

source = '<!DOCTYPE html>\n' + D.documentElement.outerHTML;
source =
  source
    .replace(new RegExp(`\\s(${BOOLEAN_ATTRS.join('|')})=""`, 'g'), ' $1')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd() + '\n';

/* ---------- 2. bundles pt/es embutidos ---------- */
const bundles = ['pt', 'es']
  .map((lang) => {
    // < evita que qualquer "</script>" no conteudo encerre o bloco
    const json = JSON.stringify(read(lang)).replace(/</g, '\\u003c');
    return `  <script type="application/json" data-i18n-bundle="${lang}">${json}</script>`;
  })
  .join('\n');

const block = `${START}\n${bundles}\n  ${END}`;

if (source.includes(START)) {
  source = source.replace(new RegExp(`${START}[\\s\\S]*?${END}`), () => block);
} else {
  // ancora tolerante: o jsdom reserializa `defer` como `defer=""`
  const anchor = /([ \t]*)<script\b[^>]*\bsrc="assets\/js\/app\.js"[^>]*><\/script>/;
  if (!anchor.test(source)) {
    console.error('ERRO: nao encontrei a tag de app.js para ancorar os bundles.');
    process.exit(1);
  }
  source = source.replace(anchor, (tag, indent) => `${indent}${block}\n${indent}${tag.trim()}`);
}

// o passo acima ja falhou em silencio uma vez: confere o resultado
const injected = (source.match(/data-i18n-bundle="/g) || []).length;
if (injected !== 2) {
  console.error(`ERRO: esperava 2 bundles embutidos, encontrei ${injected}.`);
  process.exit(1);
}

fs.writeFileSync(HTML, source);

const size = Buffer.byteLength(source) / 1024;
console.log(`index.html: ${filled} valor(es) preenchido(s) a partir de en.json`);
console.log(`bundles pt/es embutidos - arquivo agora com ${size.toFixed(1)} KB`);
if (missing.length) {
  console.error(`\nCHAVES AUSENTES em en.json: ${[...new Set(missing)].join(', ')}`);
  process.exit(1);
}
