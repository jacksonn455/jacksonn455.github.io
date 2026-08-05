#!/usr/bin/env node
/* Verifica, em todas as paginas HTML do site:
     - sintaxe do JavaScript proprio
     - que todo href/src local existe em disco (arquivo ou diretorio com index)
     - que toda ancora interna aponta para um id que existe na pagina de destino
     - higiene de acessibilidade e seguranca (alt, dimensoes, rel=noopener, h1)
     - ausencia de subrecursos externos no carregamento
     - que as chaves data-i18n existem e que os bundles estao alinhados
     - que todo <loc> do sitemap corresponde a um arquivo publicado
*/
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

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

/* ---- 1. inventario de paginas ----
   As paginas de /cursos e /afiliados sao geradas; percorrer o diretorio evita
   ter que atualizar esta lista a cada curso novo. */
const walk = (dir) =>
  fs.existsSync(path.join(ROOT, dir))
    ? fs
        .readdirSync(path.join(ROOT, dir), { withFileTypes: true })
        .flatMap((e) =>
          e.isDirectory()
            ? walk(`${dir}/${e.name}`)
            : e.name.endsWith('.html')
              ? [`${dir}/${e.name}`]
              : [],
        )
    : [];

const pages = ['index.html', '404.html', ...walk('cursos'), ...walk('afiliados')].filter((p) =>
  fs.existsSync(path.join(ROOT, p)),
);
console.log(`Paginas HTML verificadas: ${pages.length}`);

const docs = new Map(
  pages.map((p) => [p, new JSDOM(fs.readFileSync(path.join(ROOT, p), 'utf8')).window.document]),
);

/* Resolve uma URL local para o arquivo que seria entregue, a partir da pagina
   que contem o link. Resolver sempre contra a raiz do projeto — como esta
   versao fazia antes — da falso positivo em link relativo e foi exatamente o
   que deixou passar um /cursos/ absoluto quebrado fora da raiz do dominio. */
const resolveLocal = (rel, fromPage = 'index.html') => {
  const clean = decodeURI(rel.split('?')[0].split('#')[0]);
  if (!clean) return null;
  const base = clean.startsWith('/') ? ROOT : path.dirname(path.join(ROOT, fromPage));
  const target = path.resolve(base, clean.replace(/^\//, ''));
  if (fs.existsSync(target)) {
    return fs.statSync(target).isDirectory() ? path.join(target, 'index.html') : target;
  }
  return target; // inexistente: quem chama reporta
};

const isLocal = (u) => u && !/^(https?:|mailto:|tel:|data:)/.test(u);

/* ---- 2. assets e links locais ---- */
let localRefs = 0;
for (const [page, doc] of docs) {
  const refs = new Set();
  doc.querySelectorAll('[href], [src]').forEach((el) => {
    const u = (el.getAttribute('href') || el.getAttribute('src') || '').trim();
    if (isLocal(u) && !u.startsWith('#')) refs.add(u);
  });

  for (const rel of refs) {
    localRefs++;
    const file = resolveLocal(rel, page);
    if (!file || !fs.existsSync(file)) fail(`${page}: destino inexistente -> ${rel}`);
  }
}
console.log(`Referencias locais resolvidas: ${localRefs}`);

/* ---- 2b. caminho absoluto so na 404 ----
   href="/x" quebra em file://, em preview sob subpasta e em Pages de projeto.
   A 404.html e o unico caso em que ele e obrigatorio: o Pages a entrega para
   qualquer profundidade de caminho, e ali o relativo apontaria para o lugar
   errado. */
for (const [page, doc] of docs) {
  const rooted = [...doc.querySelectorAll('[href], [src]')]
    .map((el) => (el.getAttribute('href') || el.getAttribute('src') || '').trim())
    .filter((u) => u.startsWith('/'));

  if (page === '404.html') {
    if (!rooted.length)
      fail(`${page}: deveria usar caminhos absolutos (e servida de qualquer path)`);
  } else if (rooted.length) {
    fail(
      `${page}: ${rooted.length} caminho(s) absoluto(s) — quebram fora da raiz do dominio: ${[...new Set(rooted)].slice(0, 4).join(', ')}`,
    );
  }
}

/* ---- 3. ancoras internas ----
   Link para "/#portfolio" que aponta para uma secao que nao existe mais e um
   beco sem saida silencioso, tanto para o visitante quanto para o rastreador. */
let anchors = 0;
for (const [page, doc] of docs) {
  doc.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href').trim();
    if (!isLocal(href) || !href.includes('#')) return;
    const [target, id] = href.split('#');
    if (!id) return;

    let destDoc = doc;
    if (target) {
      const file = resolveLocal(target, page);
      const relKey = path.relative(ROOT, file).split(path.sep).join('/');
      if (!docs.has(relKey)) return; // arquivo nao HTML ou fora do inventario
      destDoc = docs.get(relKey);
    }
    anchors++;
    if (!destDoc.getElementById(id)) fail(`${page}: ancora sem destino -> ${href}`);
  });
}
console.log(`Ancoras internas verificadas: ${anchors}`);

/* ---- 4. higiene de acessibilidade / seguranca ---- */
for (const [page, doc] of docs) {
  const imgs = [...doc.querySelectorAll('img')];
  const noAlt = imgs.filter((i) => !i.hasAttribute('alt'));
  if (noAlt.length) fail(`${page}: ${noAlt.length} <img> sem alt`);

  // a <img> do lightbox e preenchida em runtime; suas dimensoes variam por imagem
  const staticImgs = imgs.filter((i) => !i.hasAttribute('data-lightbox-img'));
  const noDims = staticImgs.filter((i) => !i.hasAttribute('width') || !i.hasAttribute('height'));
  if (noDims.length) fail(`${page}: ${noDims.length} <img> sem width/height`);

  const blankNoRel = [...doc.querySelectorAll('a[target="_blank"]')].filter(
    (a) => !/noopener/.test(a.getAttribute('rel') || ''),
  );
  if (blankNoRel.length)
    fail(`${page}: ${blankNoRel.length} link(s) target=_blank sem rel=noopener`);

  const h1 = doc.querySelectorAll('h1').length;
  if (h1 !== 1) fail(`${page}: esperado exatamente 1 <h1>, encontrado ${h1}`);

  if (!doc.querySelector('link[rel="canonical"]')) fail(`${page}: sem <link rel="canonical">`);

  const desc = doc.querySelector('meta[name="description"]');
  if (!desc || !desc.getAttribute('content')) fail(`${page}: sem meta description`);

  if (!doc.documentElement.getAttribute('lang')) fail(`${page}: <html> sem lang`);

  /* og:image quebrado nao aparece em nenhum href/src: some silenciosamente do
     card social e o link passa a ser compartilhado sem imagem. */
  const ORIGIN_URL = 'https://jacksonmagnabosco.dev';
  const social = [
    ...[...doc.querySelectorAll('meta[property^="og:image"]')],
    ...[...doc.querySelectorAll('meta[name^="twitter:image"]')],
  ]
    .filter((m) => {
      const key = m.getAttribute('property') || m.getAttribute('name');
      return key === 'og:image' || key === 'twitter:image';
    })
    .map((m) => m.getAttribute('content'));

  if (!social.length) fail(`${page}: sem og:image`);
  for (const url of social) {
    if (!url.startsWith(ORIGIN_URL)) {
      fail(`${page}: og/twitter:image nao e URL absoluta do dominio -> ${url}`);
      continue;
    }
    const file = resolveLocal(url.slice(ORIGIN_URL.length));
    if (!fs.existsSync(file)) fail(`${page}: og/twitter:image inexistente -> ${url}`);
  }

  /* ---- 5. sem dependencias externas em tempo de carregamento ----
     canonical/hreflang/og apontam para fora por definicao e nao sao subrecursos */
  const external = [
    ...[...doc.querySelectorAll('script[src]')]
      .map((s) => s.getAttribute('src'))
      .filter((u) => /^https?:/.test(u)),
    ...[...doc.querySelectorAll('link[rel]')]
      .filter((l) =>
        /^(stylesheet|preload|preconnect|dns-prefetch|modulepreload)$/.test(l.getAttribute('rel')),
      )
      .map((l) => l.getAttribute('href'))
      .filter((u) => /^https?:/.test(u)),
  ];
  if (external.length)
    fail(`${page}: subrecursos externos no carregamento: ${external.join(', ')}`);

  /* JSON-LD tem que ser JSON valido, ou o dado estruturado inteiro e descartado */
  [...doc.querySelectorAll('script[type="application/ld+json"]')].forEach((s, i) => {
    try {
      JSON.parse(s.textContent);
    } catch (err) {
      fail(`${page}: JSON-LD invalido no bloco ${i + 1}: ${err.message}`);
    }
  });
}

/* ---- 6. titulos e descricoes unicos ----
   Duplicata de title/description e o achado mais comum de auditoria de SEO. */
for (const field of ['title', 'description']) {
  const seen = new Map();
  for (const [page, doc] of docs) {
    const value =
      field === 'title'
        ? doc.title
        : doc.querySelector('meta[name="description"]')?.getAttribute('content');
    if (!value) continue;
    if (seen.has(value)) fail(`${field} duplicado entre ${seen.get(value)} e ${page}`);
    else seen.set(value, page);
  }
}

/* ---- 7. chaves i18n (apenas a home usa i18n) ---- */
const langs = ['en', 'pt', 'es'];
const bundles = Object.fromEntries(
  langs.map((l) => [
    l,
    JSON.parse(fs.readFileSync(path.join(ROOT, `assets/i18n/${l}.json`), 'utf8')),
  ]),
);

const get = (dict, key) => key.split('.').reduce((a, p) => (a == null ? a : a[p]), dict);

const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const usedKeys = new Set([
  ...[...home.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]),
  ...[...home.matchAll(/data-i18n-attr="([^"]+)"/g)]
    .flatMap((m) => m[1].split(','))
    .map((pair) => pair.split(':')[1]?.trim())
    .filter(Boolean),
]);
console.log(`Chaves data-i18n usadas: ${usedKeys.size}`);

for (const key of usedKeys) {
  if (get(bundles.en, key) == null) fail(`chave ausente em en.json: ${key}`);
}

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

/* ---- 8. sitemap x arquivos publicados ---- */
{
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const ORIGIN = 'https://jacksonmagnabosco.dev';
  console.log(`URLs no sitemap: ${locs.length}`);

  const canonicals = new Set();
  for (const doc of docs.values()) {
    const c = doc.querySelector('link[rel="canonical"]')?.href;
    const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') || '';
    if (c && !/noindex/.test(robots)) canonicals.add(c);
  }

  for (const loc of locs) {
    if (!loc.startsWith(ORIGIN)) {
      fail(`sitemap: URL fora do dominio -> ${loc}`);
      continue;
    }
    const file = resolveLocal(loc.slice(ORIGIN.length) || '/');
    if (!fs.existsSync(file)) fail(`sitemap: URL sem arquivo publicado -> ${loc}`);
    if (!canonicals.has(loc)) fail(`sitemap: URL nao e canonical de nenhuma pagina -> ${loc}`);
  }

  // toda pagina indexavel deve estar no sitemap
  for (const c of canonicals) {
    if (!locs.includes(c)) fail(`pagina indexavel fora do sitemap -> ${c}`);
  }
}

console.log(errors ? `\n${errors} problema(s) encontrado(s).` : '\nTudo certo.');
process.exit(errors ? 1 : 0);
