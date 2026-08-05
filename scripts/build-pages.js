#!/usr/bin/env node
/*
 * Gera as paginas estaticas de conteudo a partir de data/courses.json:
 *
 *   /cursos/index.html            hub do catalogo (CollectionPage + ItemList)
 *   /cursos/<slug>/index.html     uma pagina por curso (Course + FAQPage)
 *   /afiliados/index.html         programa de afiliados (WebPage + FAQPage)
 *   /404.html                     pagina de erro do GitHub Pages (noindex)
 *   /sitemap.xml                  todas as URLs, com extensao de imagem
 *   /llms.txt                     resumo legivel por buscadores de IA
 *
 * Por que gerar em vez de escrever a mao: 12 paginas com o mesmo cabecalho,
 * a mesma navegacao e o mesmo esquema de dados divergem em uma semana. Aqui
 * existe um template e uma fonte de dados.
 *
 * As paginas sao em pt-BR de proposito: os cursos sao em portugues e a busca
 * que traz comprador ("curso de logica de programacao", "afiliado hotmart")
 * e feita em portugues. A home segue multilingue.
 *
 * Deterministico - rodar duas vezes produz bytes identicos. npm run build
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/courses.json'), 'utf8'));
const { site, courses } = DATA;
const ORIGIN = site.origin;
const LASTMOD = site.lastmod;

/* Titulo acima de 70 caracteres e cortado no resultado de busca e reprovado
   pelo html-validate (regra long-title). Falhar aqui e melhor que descobrir
   depois no CI. */
const TITLE_MAX = 70;
const DESC_MAX = 175;

let warnings = 0;
const warn = (msg) => {
  console.error('  ! ' + msg);
  warnings++;
};

/* ---------------------------------------------------------------- helpers */
const esc = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* "</script>" dentro de JSON-LD encerraria o bloco antes da hora */
const ld = (obj) => JSON.stringify(obj, null, 2).replace(/</g, '\\u003c');

const abs = (p) => ORIGIN + (p.startsWith('/') ? p : '/' + p);
const courseUrl = (slug) => `/cursos/${slug}/`;

/* Card social de 1200x630 gerado por scripts/build-og-image.js. Imagem de curso
   mais estreita que 1200px faz as redes cairem no card pequeno, sem preview
   grande — nesses casos o card generico rende mais clique. */
const SOCIAL_CARD = {
  image: 'assets/social/og-cursos.png',
  imageWidth: 1200,
  imageHeight: 630,
};

const socialImage = (course) =>
  course.imageWidth >= 1200
    ? {
        image: course.image,
        imageWidth: course.imageWidth,
        imageHeight: course.imageHeight,
        imageAlt: course.imageAlt,
      }
    : {
        ...SOCIAL_CARD,
        imageAlt: `${course.imageAlt} — cursos de tecnologia com Jackson Magnabosco`,
      };
const byslug = new Map(courses.map((c) => [c.slug, c]));
const hotmartCourses = courses.filter((c) => c.platforms.hotmart && c.affiliate);

const list = (items, cls = '') =>
  `<ul${cls ? ` class="${cls}"` : ''}>\n${items.map((i) => `          <li>${i}</li>`).join('\n')}\n        </ul>`;

const olist = (items) =>
  `<ol>\n${items.map((i) => `          <li>${esc(i)}</li>`).join('\n')}\n        </ol>`;

/* ------------------------------------------------------------------ layout */
const NAV_ITEMS = [
  { href: '/', label: 'Início' },
  { href: '/cursos/', label: 'Cursos' },
  { href: '/afiliados/', label: 'Afiliados' },
  { href: '/#projects', label: 'Projetos' },
  { href: '/#portfolio', label: 'Portfólio' },
  { href: '/#contact', label: 'Contato' },
];

const nav = (current) => `<nav class="site-nav" aria-label="Principal">
  <div class="container site-nav__inner">
    <a class="site-nav__brand" href="/">Jackson<span class="u-accent">.</span>M</a>

    <button type="button" class="icon-btn nav-toggle" data-nav-toggle aria-expanded="false" aria-controls="nav-list" aria-label="Abrir menu"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"></path></svg></button>

    <ul class="site-nav__list" id="nav-list" data-nav-list>
${NAV_ITEMS.map(
  (i) =>
    `      <li><a href="${i.href}"${i.href === current ? ' aria-current="page"' : ''}>${i.label}</a></li>`,
).join('\n')}
    </ul>

    <div class="site-nav__actions">
      <button type="button" class="icon-btn" data-theme-toggle aria-pressed="false" aria-label="Alternar modo escuro">
        <span data-theme-icon="light"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg></span>
        <span data-theme-icon="dark" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg></span>
      </button>
    </div>
  </div>
</nav>`;

const breadcrumb = (trail) => `<nav class="breadcrumb container" aria-label="Trilha de navegação">
  <ol class="breadcrumb__list">
${trail
  .map((item, i) =>
    i === trail.length - 1
      ? `    <li><span aria-current="page">${esc(item.name)}</span></li>`
      : `    <li><a href="${item.url}">${esc(item.name)}</a></li>`,
  )
  .join('\n')}
  </ol>
</nav>`;

const footer = () => `<footer class="site-footer">
  <div class="container">
    <nav aria-label="Rodapé">
      <ul class="inline-links">
        <li><a href="/">Início</a></li>
        <li><a href="/cursos/">Todos os cursos</a></li>
        <li><a href="/afiliados/">Programa de afiliados</a></li>
        <li><a href="/#experience">Experiência</a></li>
        <li><a href="/#education">Formação</a></li>
        <li><a href="/#contact">Contato</a></li>
        <li><a href="${site.youtube}" target="_blank" rel="noopener">YouTube</a></li>
        <li><a href="${site.github}" target="_blank" rel="noopener">GitHub</a></li>
        <li><a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
      </ul>
    </nav>
    <p class="site-footer__note">© 2026 ${site.author}</p>
  </div>
</footer>

<button type="button" class="to-top" data-to-top data-visible="false" aria-label="Voltar ao topo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg></button>

<script src="/assets/js/app.js" defer></script>`;

/**
 * Monta a pagina inteira. `schema` recebe um array de objetos JSON-LD.
 */
const layout = ({
  title,
  description,
  canonical,
  keywords,
  image,
  imageWidth,
  imageHeight,
  imageAlt,
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  schema = [],
  body,
  navCurrent,
  relativeLinks = true,
}) => {
  if (title.length > TITLE_MAX)
    warn(`title com ${title.length} caracteres (max ${TITLE_MAX}): ${title}`);
  if (description.length > DESC_MAX)
    warn(`description com ${description.length} caracteres (max ${DESC_MAX}) em ${canonical}`);

  /* Um bloco opcional vazio (afiliados, botao da Hotmart) deixa a indentacao
     orfa na linha. Normalizar aqui mantem o html-validate satisfeito sem
     encher os templates de condicional so por causa de espaco em branco. */
  const tidy = (html) => html.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n');

  /* Os templates escrevem os caminhos internos como "/cursos/x/" porque assim
     se leem melhor; aqui eles viram relativos a profundidade da propria pagina.
     Motivo: caminho comecando com "/" quebra o site fora da raiz de um dominio
     — em file://, em preview sob subpasta e em Pages de projeto. Relativo
     funciona nos tres casos e continua funcionando na raiz.

     A 404.html e a excecao: o GitHub Pages a entrega para qualquer caminho
     inexistente (/a/b/c tambem), e a barra de endereco continua no caminho
     pedido, entao ali o link relativo apontaria para o lugar errado. Ela
     mantem os caminhos absolutos de propósito. */
  const depth = (() => {
    const parts = canonical.replace(/^\//, '').split('/').filter(Boolean);
    return canonical.endsWith('/') ? parts.length : parts.length - 1;
  })();

  const up = '../'.repeat(depth);
  const relativize = (html) =>
    relativeLinks
      ? html.replace(
          /(href|src)="\/([^"]*)"/g,
          (_m, attr, rest) => `${attr}="${rest === '' ? up || './' : up + rest}"`,
        )
      : html;

  return relativize(
    tidy(`<!DOCTYPE html>
<html lang="pt-BR" data-theme="auto">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
${keywords ? `  <meta name="keywords" content="${esc(keywords.join(', '))}">\n` : ''}  <meta name="author" content="${esc(site.author)}">
  <meta name="robots" content="${robots}">
  <link rel="canonical" href="${abs(canonical)}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Jackson F. Magnabosco">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${abs(canonical)}">
  <meta property="og:image" content="${abs(image)}">
  <meta property="og:image:width" content="${imageWidth}">
  <meta property="og:image:height" content="${imageHeight}">
  <meta property="og:image:alt" content="${esc(imageAlt)}">
  <meta property="og:locale" content="pt_BR">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${abs(image)}">
  <meta name="twitter:image:alt" content="${esc(imageAlt)}">

  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0d1117" media="(prefers-color-scheme: dark)">

  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="stylesheet" href="/assets/css/main.css">

  <!-- aplica o tema antes da primeira pintura para nao piscar -->
  <script>
    (() => {
      try {
        const t = localStorage.getItem('preferredTheme');
        if (t === 'dark' || t === 'light') document.documentElement.dataset.theme = t;
      } catch (e) {}
    })();
  </script>
${schema.map((s) => `\n  <script type="application/ld+json">\n${ld(s)}\n  </script>`).join('')}
</head>

<body>

<a class="skip-link" href="#main">Ir para o conteúdo</a>
${nav(navCurrent)}

${body}

${footer()}

</body></html>
`),
  );
};

/* --------------------------------------------------------------- entidades */
const personNode = {
  '@type': 'Person',
  '@id': ORIGIN + '/#person',
  name: site.author,
  alternateName: site.authorShort,
  url: site.authorUrl,
  image: site.authorImage,
  jobTitle: site.jobTitle,
  description:
    'Engenheiro de Software Sênior e Professor de Ciência da Computação. Atua com Node.js, TypeScript, Java e AWS, leciona na graduação e produz cursos online de tecnologia em português.',
  knowsLanguage: ['pt-BR', 'en'],
  sameAs: [site.github, site.youtube, site.linkedin, site.medium, site.udemyProfile, site.lattes],
};

const providerRef = { '@id': ORIGIN + '/#person' };

const breadcrumbNode = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    ...(item.url ? { item: abs(item.url) } : {}),
  })),
});

const faqNode = (faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

/* Offers reais: uma por plataforma onde o curso e vendido de fato.
   Sem `price` - o valor varia por plataforma e promocao, e inventar numero
   em dado estruturado e o caminho mais rapido para uma penalidade manual. */
const offersFor = (course) => {
  const offers = [
    {
      '@type': 'Offer',
      category: 'Paid',
      url: course.platforms.udemy,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Udemy', url: 'https://www.udemy.com/' },
    },
  ];
  if (course.platforms.hotmart) {
    offers.push({
      '@type': 'Offer',
      category: 'Paid',
      url: course.platforms.hotmart,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Hotmart', url: 'https://www.hotmart.com/' },
    });
  }
  return offers;
};

const courseNode = (course) => ({
  '@type': 'Course',
  '@id': abs(courseUrl(course.slug)) + '#course',
  name: course.name,
  alternateName: course.alternateName,
  description: course.summary,
  url: abs(courseUrl(course.slug)),
  image: abs(course.image),
  inLanguage: 'pt-BR',
  educationalLevel: course.level,
  about: course.category,
  teaches: course.objectives,
  coursePrerequisites: course.prerequisites,
  audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  keywords: course.keywords.join(', '),
  provider: providerRef,
  author: providerRef,
  instructor: providerRef,
  isAccessibleForFree: false,
  syllabusSections: course.syllabus.map((name, i) => ({
    '@type': 'Syllabus',
    position: i + 1,
    name,
  })),
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'Online',
    inLanguage: 'pt-BR',
    instructor: providerRef,
  },
  offers: offersFor(course),
});

/* ------------------------------------------------------- blocos reusaveis */
const authorCard = () => `<section class="subsection" aria-labelledby="instrutor">
        <h2 id="instrutor">Quem ensina</h2>
        <div class="author-card">
          <img class="author-card__img" src="/assets/img/perfil.webp" width="555" height="394" loading="lazy" decoding="async" alt="Jackson Felipe Magnabosco">
          <div class="author-card__body">
            <p><strong>${esc(site.author)}</strong> — Engenheiro de Software Sênior e Professor de Ciência da Computação. Bacharel em Ciência da Computação pela URI-Erechim, com pós-graduação em Engenharia de Software e em Administração de Banco de Dados.</p>
            <p>Trabalha com Node.js, TypeScript, Java e AWS em produtos usados no Brasil e no exterior, lecionou na graduação em Ciência da Computação e mantém um canal no YouTube com mais de 1.500 vídeos. Os cursos online somam mais de 400 alunos em 25 países.</p>
            <ul class="inline-links">
              <li><a href="/#experience">Trajetória profissional</a></li>
              <li><a href="/#education">Formação e certificações</a></li>
              <li><a href="${site.udemyProfile}" target="_blank" rel="noopener">Perfil na Udemy</a></li>
              <li><a href="${site.youtube}" target="_blank" rel="noopener">Canal no YouTube</a></li>
              <li><a href="${site.github}" target="_blank" rel="noopener">GitHub</a></li>
              <li><a href="${site.lattes}" target="_blank" rel="noopener">Currículo Lattes</a></li>
            </ul>
          </div>
        </div>
      </section>`;

const faqBlock = (
  faq,
  headingId = 'faq',
) => `<section class="subsection" aria-labelledby="${headingId}">
        <h2 id="${headingId}">Perguntas frequentes</h2>
        <div class="faq">
${faq
  .map(
    (f) => `          <details class="faq__item">
            <summary>${esc(f.q)}</summary>
            <div class="faq__answer"><p>${esc(f.a)}</p></div>
          </details>`,
  )
  .join('\n')}
        </div>
      </section>`;

const affiliateBand = (course) => {
  if (!course.affiliate) return '';
  return `<aside class="cta-band">
        <div class="cta-band__text">
          <h2>Ganhe ${site.affiliateCommission} revendendo este curso</h2>
          <p>Este curso participa do programa de afiliados da Hotmart: você divulga com um link exclusivo e recebe ${site.affiliateCommission} de comissão por venda. O cadastro é gratuito.</p>
        </div>
        <p><a class="btn btn--ghost" href="${course.affiliate}" target="_blank" rel="noopener">Quero me afiliar a este curso</a></p>
      </aside>`;
};

/* --------------------------------------------------------- pagina do curso */
const renderCourse = (course) => {
  const url = courseUrl(course.slug);
  const trail = [
    { name: 'Início', url: '/' },
    { name: 'Cursos', url: '/cursos/' },
    { name: course.shortName },
  ];

  const platformRows = [
    `<tr>
              <th scope="row">Udemy</th>
              <td>Compra direta na Udemy, com app oficial e acompanhamento de progresso. Preço e promoções seguem a plataforma.</td>
              <td><a class="btn btn--udemy btn--sm" href="${course.platforms.udemy}" target="_blank" rel="noopener">Ver na Udemy</a></td>
            </tr>`,
  ];
  if (course.platforms.hotmart) {
    platformRows.push(`<tr>
              <th scope="row">Hotmart</th>
              <td>Compra direta na Hotmart. É também a plataforma do programa de afiliados: dá para revender o curso e receber ${site.affiliateCommission} por venda.</td>
              <td><a class="btn btn--hotmart btn--sm" href="${course.platforms.hotmart}" target="_blank" rel="noopener">Ver na Hotmart</a></td>
            </tr>`);
  }

  const related = course.related
    .map((slug) => byslug.get(slug))
    .filter(Boolean)
    .map(
      (r) => `          <li class="mini-card">
            <h3 class="mini-card__title"><a href="${courseUrl(r.slug)}">${esc(r.shortName)}</a></h3>
            <p>${esc(r.summary.split('. ')[0])}.</p>
          </li>`,
    )
    .join('\n');

  const body = `${breadcrumb(trail)}

<main id="main">
  <article class="section">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">Curso online · ${esc(course.category)}</p>
        <h1>${esc(course.h1)}</h1>
        <p class="lead">${esc(course.summary)}</p>
        <ul class="chips">
          <li class="chip"><strong>Nível:</strong> ${esc(course.level)}</li>
          <li class="chip"><strong>Idioma:</strong> Português (pt-BR)</li>
          <li class="chip"><strong>Formato:</strong> Vídeoaulas online, no seu ritmo</li>
          <li class="chip"><strong>Instrutor:</strong> ${esc(site.authorShort)}</li>
          <li class="chip"><strong>Onde comprar:</strong> ${course.platforms.hotmart ? 'Udemy e Hotmart' : 'Udemy'}</li>
        </ul>
        <p class="course-card__actions">
          <a class="btn btn--udemy" href="${course.platforms.udemy}" target="_blank" rel="noopener">Comprar na Udemy</a>
${course.platforms.hotmart ? `          <a class="btn btn--hotmart" href="${course.platforms.hotmart}" target="_blank" rel="noopener">Comprar na Hotmart</a>\n` : ''}        </p>
      </header>

      <img class="course-hero__img" src="/${course.image}" width="${course.imageWidth}" height="${course.imageHeight}" fetchpriority="high" decoding="async" alt="${esc(course.imageAlt)}">

      <div class="prose">
        <div class="tldr">
          <h2>Em resumo</h2>
          <p>${esc(course.summary)}</p>
        </div>

        <section aria-labelledby="sobre">
          <h2 id="sobre">Sobre o curso</h2>
${course.intro.map((p) => `          <p>${esc(p)}</p>`).join('\n')}
        </section>

        <section aria-labelledby="aprender">
          <h2 id="aprender">O que você vai aprender</h2>
          ${list(course.objectives.map(esc))}
        </section>

        <section aria-labelledby="conteudo">
          <h2 id="conteudo">Conteúdo do curso</h2>
          ${olist(course.syllabus)}
        </section>

        <section aria-labelledby="publico">
          <h2 id="publico">Para quem é este curso</h2>
          ${list(course.audience.map(esc))}
        </section>

        <section aria-labelledby="requisitos">
          <h2 id="requisitos">Pré-requisitos</h2>
          ${list(course.prerequisites.map(esc))}
        </section>

        <section aria-labelledby="temas">
          <h2 id="temas">Tecnologias e temas abordados</h2>
          <ul class="chips">
${course.technologies.map((t) => `            <li class="chip">${esc(t)}</li>`).join('\n')}
          </ul>
        </section>
      </div>

      <section class="subsection" aria-labelledby="onde-comprar">
        <h2 id="onde-comprar">Onde comprar: Udemy ou Hotmart</h2>
        <p class="u-measure u-muted">${course.platforms.hotmart ? 'O conteúdo é o mesmo nas duas plataformas. A diferença está no que cada uma oferece em volta dele.' : 'Este curso é vendido apenas na Udemy no momento.'}</p>
        <div class="table-wrap">
          <table class="table">
            <caption>Plataformas em que <em>${esc(course.shortName)}</em> está disponível</caption>
            <thead>
              <tr>
                <th scope="col">Plataforma</th>
                <th scope="col">Como funciona</th>
                <th scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
            ${platformRows.join('\n            ')}
            </tbody>
          </table>
        </div>
      </section>

      ${faqBlock(course.faq)}

      ${authorCard()}

      <section class="subsection" aria-labelledby="relacionados">
        <h2 id="relacionados">Cursos relacionados</h2>
        <ul class="mini-grid">
${related}
        </ul>
        <p><a href="/cursos/">Ver o catálogo completo de cursos</a></p>
      </section>

      <section class="subsection" aria-labelledby="conteudo-extra">
        <h2 id="conteudo-extra">Conteúdo relacionado no site</h2>
        <ul class="link-list">
${course.relatedContent
  .map(
    (r) =>
      `          <li><a class="link-item" href="${r.url}"${r.url.startsWith('http') && !r.url.startsWith(ORIGIN) ? ' target="_blank" rel="noopener"' : ''}>${esc(r.label)}</a></li>`,
  )
  .join('\n')}
        </ul>
      </section>

      ${affiliateBand(course)}
    </div>
  </article>
</main>`;

  return layout({
    title: course.metaTitle,
    description: course.metaDescription,
    canonical: url,
    keywords: course.keywords,
    ...socialImage(course),
    navCurrent: '/cursos/',
    body,
    schema: [
      {
        '@context': 'https://schema.org',
        '@graph': [
          personNode,
          courseNode(course),
          breadcrumbNode(trail),
          faqNode(course.faq),
          {
            '@type': 'WebPage',
            '@id': abs(url),
            url: abs(url),
            name: course.metaTitle,
            description: course.metaDescription,
            inLanguage: 'pt-BR',
            isPartOf: { '@id': ORIGIN + '/#website' },
            primaryImageOfPage: abs(course.image),
            about: { '@id': abs(url) + '#course' },
          },
          {
            '@type': 'WebSite',
            '@id': ORIGIN + '/#website',
            url: ORIGIN + '/',
            name: 'Jackson F. Magnabosco',
            inLanguage: 'pt-BR',
            publisher: providerRef,
          },
        ],
      },
    ],
  });
};

/* ----------------------------------------------------------- hub /cursos/ */
const HUB_TRACKS = [
  {
    title: 'Trilha 1 — começar a programar do zero',
    steps: ['logica-de-programacao', 'desenvolvimento-web', 'design-de-interfaces'],
    why: 'Primeiro o raciocínio, depois a construção de aplicações e, por fim, a qualidade da interface que o usuário vê.',
  },
  {
    title: 'Trilha 2 — dados, do banco ao conhecimento',
    steps: ['administracao-de-banco-de-dados', 'mineracao-de-dados', 'engenharia-de-prompt'],
    why: 'Administrar a base, extrair padrões dela com KDD e usar IA generativa como ferramenta de análise e produtividade.',
  },
  {
    title: 'Trilha 3 — carreira e responsabilidade profissional',
    steps: ['etica-e-legislacao-profissional', 'posicionamento-profissional-global'],
    why: 'O que a lei exige de quem trabalha com dados e sistemas, e como se posicionar para vagas remotas e internacionais.',
  },
];

const renderHub = () => {
  const trail = [{ name: 'Início', url: '/' }, { name: 'Cursos' }];

  const rows = courses
    .map(
      (c) => `            <tr>
              <th scope="row"><a href="${courseUrl(c.slug)}">${esc(c.shortName)}</a></th>
              <td>${esc(c.category)}</td>
              <td>${esc(c.level)}</td>
              <td>${c.platforms.hotmart ? 'Udemy e Hotmart' : 'Udemy'}</td>
            </tr>`,
    )
    .join('\n');

  const cards = courses
    .map(
      (c) => `        <li class="course-card">
          <img class="course-card__img" src="/${c.image}" width="${c.imageWidth}" height="${c.imageHeight}" loading="lazy" decoding="async" alt="${esc(c.imageAlt)}">
          <div class="course-card__body">
            <h3 class="course-card__title"><a href="${courseUrl(c.slug)}">${esc(c.name)}</a></h3>
            <p class="course-card__text">${esc(c.summary.split('. ')[0])}.</p>
            <p class="course-card__actions">
              <a class="btn btn--ghost btn--sm" href="${courseUrl(c.slug)}">Detalhes do curso</a>
              <a class="btn btn--udemy btn--sm" href="${c.platforms.udemy}" target="_blank" rel="noopener">Udemy</a>
${c.platforms.hotmart ? `              <a class="btn btn--hotmart btn--sm" href="${c.platforms.hotmart}" target="_blank" rel="noopener">Hotmart</a>\n` : ''}            </p>
          </div>
        </li>`,
    )
    .join('\n');

  const tracks = HUB_TRACKS.map(
    (t) => `        <li class="mini-card">
          <h3 class="mini-card__title">${esc(t.title)}</h3>
          <p>${esc(t.why)}</p>
          <ol>
${t.steps.map((s) => `            <li><a href="${courseUrl(s)}">${esc(byslug.get(s).shortName)}</a></li>`).join('\n')}
          </ol>
        </li>`,
  ).join('\n');

  const faq = [
    {
      q: 'Os cursos são em português?',
      a: 'Sim, todos os cursos são gravados em português brasileiro, com exemplos e casos do mercado nacional.',
    },
    {
      q: 'Preciso ter experiência para começar?',
      a: 'Não necessariamente. Há cursos que partem do zero — Lógica de Programação e Algoritmos é o ponto de entrada recomendado — e cursos que aprofundam temas específicos, como administração de banco de dados e mineração de dados. Cada página indica nível e pré-requisitos.',
    },
    {
      q: 'Qual a diferença entre comprar na Udemy e na Hotmart?',
      a: 'O conteúdo é o mesmo. A Udemy concentra tudo em uma biblioteca com app próprio; a Hotmart, além da compra, permite se afiliar ao curso e revendê-lo com 40% de comissão por venda. Sete dos cursos estão nas duas plataformas.',
    },
    {
      q: 'Existe uma ordem recomendada para fazer os cursos?',
      a: 'Sim. Há três trilhas sugeridas nesta página: começar a programar do zero, dados do banco ao conhecimento, e carreira e responsabilidade profissional. Elas encadeiam os cursos na ordem em que os pré-requisitos aparecem.',
    },
    {
      q: 'Quem é o instrutor?',
      a: 'Jackson Felipe Magnabosco, engenheiro de software sênior e professor de Ciência da Computação, com pós-graduação em Engenharia de Software e em Administração de Banco de Dados. Mais de 400 alunos em 25 países e um canal no YouTube com mais de 1.500 vídeos.',
    },
    {
      q: 'É possível ganhar dinheiro divulgando estes cursos?',
      a: 'Sim. Os sete cursos disponíveis na Hotmart têm programa de afiliados com 40% de comissão por venda. O cadastro é gratuito e os links de afiliação estão na página do programa de afiliados.',
    },
  ];

  const body = `${breadcrumb(trail)}

<main id="main">
  <article class="section">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">Catálogo completo</p>
        <h1>Cursos de programação e tecnologia em português</h1>
        <p class="lead">Nove cursos online de software, dados, interfaces, IoT, IA e carreira, criados e gravados por Jackson Felipe Magnabosco — engenheiro de software sênior e professor de Ciência da Computação. Mais de 400 alunos em 25 países.</p>
        <ul class="chips">
          <li class="chip"><strong>9</strong> cursos</li>
          <li class="chip"><strong>Idioma:</strong> Português (pt-BR)</li>
          <li class="chip"><strong>Plataformas:</strong> Udemy e Hotmart</li>
          <li class="chip"><strong>Afiliados:</strong> ${site.affiliateCommission} por venda</li>
        </ul>
      </header>

      <div class="prose prose--wide">
        <div class="tldr">
          <h2>Em resumo</h2>
          <p>Este é o catálogo de cursos de Jackson Felipe Magnabosco: fundamentos de programação, desenvolvimento web, banco de dados, mineração de dados, design de interfaces, Internet das Coisas, ética e legislação em TI, engenharia de prompt e posicionamento profissional. Todos em português, gravados para estudo no próprio ritmo, vendidos na Udemy e — sete deles — também na Hotmart, onde existe programa de afiliados com ${site.affiliateCommission} de comissão.</p>
        </div>

        <section aria-labelledby="comparativo">
          <h2 id="comparativo">Comparativo dos cursos</h2>
          <div class="table-wrap">
            <table class="table">
              <caption>Nível, área e plataformas de cada curso</caption>
              <thead>
                <tr>
                  <th scope="col">Curso</th>
                  <th scope="col">Área</th>
                  <th scope="col">Nível</th>
                  <th scope="col">Onde comprar</th>
                </tr>
              </thead>
              <tbody>
${rows}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section class="subsection" aria-labelledby="todos">
        <h2 id="todos">Todos os cursos</h2>
        <ul class="course-grid">
${cards}
        </ul>
      </section>

      <section class="subsection" aria-labelledby="trilhas">
        <h2 id="trilhas">Por onde começar: trilhas sugeridas</h2>
        <p class="u-measure u-muted">Os cursos são independentes, mas alguns se encadeiam melhor em uma ordem específica. Estas são as sequências que recomendo.</p>
        <ul class="mini-grid">
${tracks}
        </ul>
      </section>

      ${faqBlock(faq)}

      ${authorCard()}

      <aside class="cta-band">
        <div class="cta-band__text">
          <h2>Quer vender estes cursos e ganhar ${site.affiliateCommission} por venda?</h2>
          <p>Sete cursos do catálogo participam do programa de afiliados da Hotmart. Cadastro gratuito, link exclusivo de divulgação e comissão de ${site.affiliateCommission} em cada venda realizada.</p>
        </div>
        <p><a class="btn btn--ghost" href="/afiliados/">Ver o programa de afiliados</a></p>
      </aside>
    </div>
  </article>
</main>`;

  return layout({
    title: 'Cursos de Programação e Tecnologia | Jackson Magnabosco',
    description:
      'Catálogo de 9 cursos online em português: lógica de programação, desenvolvimento web, banco de dados, mineração de dados, IHC, IoT, ética em TI, IA e carreira em tecnologia.',
    canonical: '/cursos/',
    keywords: [
      'cursos de programação em português',
      'curso de tecnologia online',
      'curso de desenvolvimento web',
      'curso de banco de dados',
      'curso de mineração de dados',
      'curso de iot',
      'jackson magnabosco cursos',
    ],
    ...SOCIAL_CARD,
    imageAlt: 'Cursos de programação e tecnologia de Jackson Magnabosco',
    navCurrent: '/cursos/',
    body,
    schema: [
      {
        '@context': 'https://schema.org',
        '@graph': [
          personNode,
          {
            '@type': 'WebSite',
            '@id': ORIGIN + '/#website',
            url: ORIGIN + '/',
            name: 'Jackson F. Magnabosco',
            inLanguage: 'pt-BR',
            publisher: providerRef,
          },
          {
            '@type': 'CollectionPage',
            '@id': abs('/cursos/'),
            url: abs('/cursos/'),
            name: 'Cursos de programação e tecnologia em português',
            description:
              'Catálogo completo dos cursos online de Jackson Felipe Magnabosco, com nível, conteúdo e plataformas de venda.',
            inLanguage: 'pt-BR',
            isPartOf: { '@id': ORIGIN + '/#website' },
            about: { '@id': ORIGIN + '/#person' },
          },
          breadcrumbNode(trail),
          {
            '@type': 'ItemList',
            name: 'Cursos online de Jackson Felipe Magnabosco',
            numberOfItems: courses.length,
            itemListElement: courses.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: abs(courseUrl(c.slug)),
              name: c.name,
            })),
          },
          faqNode(faq),
        ],
      },
    ],
  });
};

/* ------------------------------------------------------ pagina /afiliados/ */
const renderAffiliates = () => {
  const trail = [{ name: 'Início', url: '/' }, { name: 'Programa de afiliados' }];

  const rows = hotmartCourses
    .map(
      (c) => `            <tr>
              <th scope="row"><a href="${courseUrl(c.slug)}">${esc(c.shortName)}</a></th>
              <td>${esc(c.category)}</td>
              <td><a class="btn btn--hotmart btn--sm" href="${c.affiliate}" target="_blank" rel="noopener">Solicitar afiliação</a></td>
            </tr>`,
    )
    .join('\n');

  const faq = [
    {
      q: 'Como funciona o programa de afiliados destes cursos?',
      a: 'Você se cadastra gratuitamente na Hotmart, solicita afiliação ao curso que quer divulgar e, após a aprovação, recebe um link exclusivo. Toda venda feita por esse link gera 40% de comissão para você. A Hotmart cuida do pagamento, da entrega do curso e do suporte ao aluno.',
    },
    {
      q: 'Quanto eu recebo por venda?',
      a: '40% do valor da venda, conforme a comissão configurada para os produtos na Hotmart. O valor exato em reais depende do preço vigente do curso no momento da compra.',
    },
    {
      q: 'Preciso investir algo para começar?',
      a: 'Não. A conta na Hotmart é gratuita, não existe estoque para comprar e você não precisa produzir o conteúdo. O investimento é o seu tempo de divulgação.',
    },
    {
      q: 'Quais cursos posso divulgar como afiliado?',
      a: 'Os sete cursos vendidos na Hotmart: desenvolvimento web, design de interfaces, mineração de dados, ética e legislação profissional, lógica de programação, Internet das Coisas e administração de banco de dados. Os dois cursos exclusivos da Udemy não fazem parte do programa.',
    },
    {
      q: 'Quanto tempo leva a aprovação da afiliação?',
      a: 'A solicitação passa por aprovação e isso pode levar algumas horas. O prazo e as regras seguem o funcionamento da própria Hotmart.',
    },
    {
      q: 'Onde vale a pena divulgar?',
      a: 'Os cursos vendem bem para quem está começando em tecnologia e para estudantes: grupos de WhatsApp e Telegram de cursos técnicos e graduação, comunidades de programação, perfis e canais que falam de carreira em TI, blogs e listas de e-mail. Divulgar para um público que já quer aprender programação converte muito mais que alcance genérico.',
    },
    {
      q: 'Preciso ter feito o curso para divulgá-lo?',
      a: 'Não é exigido, mas ajuda muito. Quem conhece o conteúdo divulga com argumentos concretos — e cada curso tem uma página aqui no site com ementa completa, público-alvo e pré-requisitos para você usar como base.',
    },
  ];

  const body = `${breadcrumb(trail)}

<main id="main">
  <article class="section">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">Programa de afiliados Hotmart</p>
        <h1>Ganhe ${site.affiliateCommission} de comissão revendendo cursos de tecnologia</h1>
        <p class="lead">Sete cursos de programação e tecnologia disponíveis para afiliação na Hotmart, com ${site.affiliateCommission} de comissão por venda. Cadastro gratuito, sem estoque e sem suporte para dar: você divulga, a Hotmart cuida do resto.</p>
        <ul class="chips">
          <li class="chip"><strong>Comissão:</strong> ${site.affiliateCommission} por venda</li>
          <li class="chip"><strong>Cursos disponíveis:</strong> ${hotmartCourses.length}</li>
          <li class="chip"><strong>Custo de entrada:</strong> nenhum</li>
          <li class="chip"><strong>Plataforma:</strong> Hotmart</li>
        </ul>
      </header>

      <div class="prose prose--wide">
        <div class="tldr">
          <h2>Em resumo</h2>
          <p>O programa de afiliados permite que qualquer pessoa revenda os cursos de Jackson Felipe Magnabosco e receba ${site.affiliateCommission} do valor de cada venda. Você cria uma conta gratuita na Hotmart, solicita afiliação ao curso desejado, recebe um link exclusivo de divulgação e passa a ser comissionado por venda. Não há estoque, produção de conteúdo nem atendimento ao aluno do seu lado — a Hotmart processa pagamento, entrega e suporte.</p>
        </div>

        <section aria-labelledby="como-funciona">
          <h2 id="como-funciona">Como funciona, passo a passo</h2>
          <ol>
            <li><strong>Crie sua conta gratuita na Hotmart.</strong> É a plataforma que hospeda os cursos e processa as vendas.</li>
            <li><strong>Solicite afiliação ao curso.</strong> Escolha um curso na tabela abaixo e clique em “Solicitar afiliação”.</li>
            <li><strong>Aguarde a aprovação.</strong> Pode levar algumas horas; você é notificado pela própria Hotmart.</li>
            <li><strong>Divulgue seu link exclusivo.</strong> Cada venda feita por ele é registrada no seu nome.</li>
            <li><strong>Receba ${site.affiliateCommission} por venda.</strong> A comissão é creditada conforme as regras de pagamento da Hotmart.</li>
          </ol>
        </section>

        <section aria-labelledby="por-que">
          <h2 id="por-que">Por que estes cursos vendem</h2>
          <p>São cursos de entrada em tecnologia, a faixa de maior demanda do mercado brasileiro de educação online: lógica de programação, desenvolvimento web e banco de dados atendem quem está tentando entrar na área, e ética profissional e IHC atendem estudantes de graduação com essas disciplinas na grade.</p>
          <p>O catálogo tem autoridade para sustentar a divulgação: os cursos são produzidos por um engenheiro de software sênior que também é professor de Ciência da Computação, com mais de 400 alunos em 25 países, artigo científico publicado e um canal no YouTube com mais de 1.500 vídeos. Cada curso tem uma página completa neste site, com ementa e público-alvo, que você pode usar como material de apoio na divulgação.</p>
        </section>
      </div>

      <section class="subsection" aria-labelledby="cursos-disponiveis">
        <h2 id="cursos-disponiveis">Cursos disponíveis para afiliação</h2>
        <div class="table-wrap">
          <table class="table">
            <caption>Os ${hotmartCourses.length} cursos com programa de afiliados ativo na Hotmart</caption>
            <thead>
              <tr>
                <th scope="col">Curso</th>
                <th scope="col">Área</th>
                <th scope="col">Afiliação</th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
        <p class="u-sm u-muted u-measure">As comissões, a aprovação e os pagamentos são gerenciados pela Hotmart. É necessário ter uma conta gratuita na plataforma.</p>
      </section>

      ${faqBlock(faq)}

      ${authorCard()}

      <aside class="cta-band">
        <div class="cta-band__text">
          <h2>Quer conhecer o conteúdo antes de divulgar?</h2>
          <p>Cada curso tem uma página com ementa completa, nível, público-alvo e pré-requisitos — o material que você precisa para divulgar com argumento em vez de slogan.</p>
        </div>
        <p><a class="btn btn--ghost" href="/cursos/">Ver o catálogo de cursos</a></p>
      </aside>
    </div>
  </article>
</main>`;

  return layout({
    title: 'Programa de Afiliados: 40% por venda em cursos de TI',
    description:
      'Torne-se afiliado dos cursos de tecnologia de Jackson Magnabosco na Hotmart e ganhe 40% de comissão por venda. Sete cursos disponíveis, cadastro gratuito e link exclusivo.',
    canonical: '/afiliados/',
    keywords: [
      'programa de afiliados hotmart',
      'como ser afiliado hotmart',
      'afiliado curso de programação',
      'ganhar dinheiro vendendo cursos',
      'comissão de 40%',
      'renda extra com cursos online',
    ],
    ...SOCIAL_CARD,
    imageAlt: 'Programa de afiliados dos cursos de tecnologia de Jackson Magnabosco',
    navCurrent: '/afiliados/',
    body,
    schema: [
      {
        '@context': 'https://schema.org',
        '@graph': [
          personNode,
          {
            '@type': 'WebSite',
            '@id': ORIGIN + '/#website',
            url: ORIGIN + '/',
            name: 'Jackson F. Magnabosco',
            inLanguage: 'pt-BR',
            publisher: providerRef,
          },
          {
            '@type': 'WebPage',
            '@id': abs('/afiliados/'),
            url: abs('/afiliados/'),
            name: 'Programa de afiliados: 40% de comissão por venda',
            description:
              'Como se afiliar aos cursos de tecnologia de Jackson Felipe Magnabosco na Hotmart e receber 40% de comissão por venda.',
            inLanguage: 'pt-BR',
            isPartOf: { '@id': ORIGIN + '/#website' },
            about: { '@id': ORIGIN + '/#person' },
          },
          breadcrumbNode(trail),
          faqNode(faq),
          {
            '@type': 'ItemList',
            name: 'Cursos disponíveis para afiliação na Hotmart',
            numberOfItems: hotmartCourses.length,
            itemListElement: hotmartCourses.map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: abs(courseUrl(c.slug)),
              name: c.name,
            })),
          },
        ],
      },
    ],
  });
};

/* ------------------------------------------------------------------- 404 */
const render404 = () =>
  layout({
    title: 'Página não encontrada | Jackson F. Magnabosco',
    description:
      'A página que você procura não existe ou foi movida. Veja os caminhos principais do site.',
    canonical: '/404.html',
    robots: 'noindex, follow',
    image: 'assets/img/perfil.webp',
    imageWidth: 555,
    imageHeight: 394,
    imageAlt: 'Jackson Felipe Magnabosco',
    navCurrent: '',
    // entregue para qualquer caminho inexistente: precisa de caminho absoluto
    relativeLinks: false,
    body: `<main id="main">
  <article class="section">
    <div class="container">
      <header class="page-head">
        <p class="eyebrow">Erro 404</p>
        <h1>Esta página não existe</h1>
        <p class="lead">O endereço pode ter mudado ou o link estar incorreto. Abaixo estão os caminhos mais usados do site.</p>
      </header>
      <div class="prose">
        <section aria-labelledby="caminhos">
          <h2 id="caminhos">Para onde ir agora</h2>
          <ul>
            <li><a href="/">Página inicial</a> — projetos, experiência, formação e portfólio</li>
            <li><a href="/cursos/">Catálogo de cursos</a> — nove cursos de programação e tecnologia em português</li>
            <li><a href="/afiliados/">Programa de afiliados</a> — ganhe 40% revendendo os cursos</li>
            <li><a href="/#projects">Projetos</a> — plataformas e sistemas em que trabalhei</li>
            <li><a href="/#contact">Contato</a></li>
          </ul>
        </section>
      </div>
    </div>
  </article>
</main>`,
  });

/* --------------------------------------------------------------- sitemap */
const sitemap = () => {
  const entry = ({ loc, priority, changefreq, image, imageAlt, alternates }) =>
    `  <url>
    <loc>${loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${
      alternates
        ? '\n' +
          alternates
            .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}"/>`)
            .join('\n')
        : ''
    }${
      image
        ? `\n    <image:image>\n      <image:loc>${image}</image:loc>\n      <image:title>${esc(imageAlt)}</image:title>\n    </image:image>`
        : ''
    }
  </url>`;

  const urls = [
    entry({
      loc: ORIGIN + '/',
      priority: '1.0',
      changefreq: 'monthly',
      alternates: [
        { lang: 'en', href: ORIGIN + '/?lang=en' },
        { lang: 'pt', href: ORIGIN + '/?lang=pt' },
        { lang: 'es', href: ORIGIN + '/?lang=es' },
        { lang: 'x-default', href: ORIGIN + '/' },
      ],
    }),
    entry({ loc: abs('/cursos/'), priority: '0.9', changefreq: 'monthly' }),
    entry({ loc: abs('/afiliados/'), priority: '0.8', changefreq: 'monthly' }),
    ...courses.map((c) =>
      entry({
        loc: abs(courseUrl(c.slug)),
        priority: '0.8',
        changefreq: 'monthly',
        image: abs(c.image),
        imageAlt: c.imageAlt,
      }),
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`;
};

/* ---------------------------------------------------------------- llms.txt
   Convencao emergente (llmstxt.org) para dar a buscadores de IA um resumo
   limpo do site em markdown, sem navegacao nem script no meio do texto. */
const llmsTxt = () => `# Jackson F. Magnabosco

> Engenheiro de Software Sênior e Professor de Ciência da Computação (Erechim, RS, Brasil). Desenvolve backends e produtos digitais com Node.js, TypeScript, Java e AWS, e produz cursos online de tecnologia em português com mais de 400 alunos em 25 países.

Site pessoal e catálogo de cursos. Conteúdo em português (cursos) e em inglês, português e espanhol (página inicial).

## Perfil

- Formação: Bacharelado em Ciência da Computação (URI-Erechim), pós-graduação em Engenharia de Software e em Administração de Banco de Dados.
- Atuação: engenharia de software sênior (backend, arquitetura, produto), docência em Ciência da Computação e produção de cursos online.
- Tecnologias: Node.js, TypeScript, Java, Spring Boot, NestJS, React, AWS, microsserviços, SQL, MySQL, Python, R, mineração de dados, IoT, IHC/UX.
- Publicação científica: artigo no Brazilian Journal of Technology (DOI 10.38152/bjtv8n3-002).
- Canal no YouTube com mais de 1.500 vídeos gratuitos de programação e tecnologia.

## Páginas principais

- [Página inicial](${ORIGIN}/): projetos, experiência profissional, formação, certificações e portfólio.
- [Catálogo de cursos](${abs('/cursos/')}): os nove cursos, com comparativo de nível, área e plataforma, e trilhas de estudo sugeridas.
- [Programa de afiliados](${abs('/afiliados/')}): como revender os cursos na Hotmart com 40% de comissão por venda.

## Cursos

${courses
  .map(
    (c) =>
      `- [${c.name}](${abs(courseUrl(c.slug))}): ${c.summary} Nível: ${c.level}. Idioma: português (pt-BR). Onde comprar: ${c.platforms.hotmart ? 'Udemy e Hotmart' : 'Udemy'}.`,
  )
  .join('\n')}

## Programa de afiliados

Sete dos nove cursos (todos exceto Engenharia de Prompt e Posicionamento Profissional Global) estão disponíveis para afiliação na Hotmart, com comissão de ${site.affiliateCommission} por venda. O cadastro na Hotmart é gratuito e a solicitação de afiliação é feita por curso.

## Links externos

- Perfil de instrutor na Udemy: ${site.udemyProfile}
- YouTube: ${site.youtube}
- GitHub: ${site.github}
- LinkedIn: ${site.linkedin}
- Medium: ${site.medium}
- Currículo Lattes: ${site.lattes}
`;

/* ------------------------------------------------- grafo de entidades da home
   A home e multilingue e montada pelo build-i18n; aqui so trocamos o bloco
   entre os marcadores, para que os cursos citados em dado estruturado nunca
   divirjam de data/courses.json.

   Formato de pagina-resumo do Google: a home e o hub publicam um ItemList que
   aponta para as paginas de curso, e cada pagina de curso carrega o Course
   completo. Nada de Course duplicado nos dois lugares. */
const HOME_START = '<!-- jsonld:start -->';
const HOME_END = '<!-- jsonld:end -->';

const homeSchema = () => {
  const knowsAbout = [
    ...new Set([
      'Software Engineering',
      'Node.js',
      'TypeScript',
      'Java',
      'Spring Boot',
      'NestJS',
      'React',
      'AWS',
      'Microservices',
      'Software Architecture',
      'Database Administration',
      'SQL',
      'Data Mining',
      'UX/UI Design',
      'Internet of Things',
      'Artificial Intelligence',
      'Computer Science Education',
      ...courses.flatMap((c) => c.technologies),
    ]),
  ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...personNode,
        email: 'mailto:jacksonmagnabosco@hotmail.com',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Erechim',
          addressRegion: 'RS',
          addressCountry: 'BR',
        },
        worksFor: {
          '@type': 'Organization',
          name: 'Covetrus',
          url: 'https://www.covetrus.com/',
        },
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Universidade Regional Integrada do Alto Uruguai e das Missões',
            url: 'https://www.uricer.edu.br/',
          },
          { '@type': 'CollegeOrUniversity', name: 'Faculdade Metropolitana' },
        ],
        hasCredential: [
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Postgraduate degree',
            name: 'Pós-graduação em Engenharia de Software',
          },
          {
            '@type': 'EducationalOccupationalCredential',
            credentialCategory: 'Postgraduate degree',
            name: 'Pós-graduação em Administração de Banco de Dados',
          },
        ],
        knowsAbout,
      },
      {
        '@type': 'WebSite',
        '@id': ORIGIN + '/#website',
        url: ORIGIN + '/',
        name: 'Jackson F. Magnabosco',
        description:
          'Portfólio e catálogo de cursos de Jackson Felipe Magnabosco: engenharia de software, dados, interfaces, IoT e carreira em tecnologia.',
        inLanguage: ['en', 'pt-BR', 'es'],
        publisher: providerRef,
        author: providerRef,
      },
      {
        '@type': 'ProfilePage',
        '@id': ORIGIN + '/#webpage',
        url: ORIGIN + '/',
        name: 'Jackson F. Magnabosco - Senior Software Engineer & Professor',
        isPartOf: { '@id': ORIGIN + '/#website' },
        about: providerRef,
        mainEntity: providerRef,
        primaryImageOfPage: site.authorImage,
        inLanguage: 'en',
      },
      {
        '@type': 'ItemList',
        name: 'Cursos online de Jackson Felipe Magnabosco',
        description:
          'Cursos de programação e tecnologia em português, vendidos na Udemy e na Hotmart.',
        numberOfItems: courses.length,
        itemListElement: courses.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: abs(courseUrl(c.slug)),
          name: c.name,
        })),
      },
    ],
  };
};

const injectHomeSchema = () => {
  const file = path.join(ROOT, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const from = html.indexOf(HOME_START);
  const to = html.indexOf(HOME_END);
  if (from === -1 || to === -1) {
    console.error(`ERRO: marcadores ${HOME_START} / ${HOME_END} nao encontrados em index.html.`);
    process.exit(1);
  }
  const block = `${HOME_START}\n  <script type="application/ld+json">\n${ld(homeSchema())}\n  </script>\n  ${HOME_END}`;
  const next = html.slice(0, from) + block + html.slice(to + HOME_END.length);
  if (next === html) return false;
  fs.writeFileSync(file, next);
  return true;
};

/* ------------------------------------------------------------------ escrita */
const write = (rel, content) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const previous = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (previous === content) return false;
  fs.writeFileSync(file, content);
  return true;
};

const written = [];
const track = (rel, content) => {
  if (write(rel, content)) written.push(rel);
};

track('cursos/index.html', renderHub());
courses.forEach((c) => track(`cursos/${c.slug}/index.html`, renderCourse(c)));
track('afiliados/index.html', renderAffiliates());
track('404.html', render404());
track('sitemap.xml', sitemap());
track('llms.txt', llmsTxt());
if (injectHomeSchema()) written.push('index.html (grafo JSON-LD)');

console.log(
  `paginas geradas: ${courses.length} cursos + hub + afiliados + 404, sitemap e llms.txt`,
);
console.log(written.length ? `arquivos atualizados: ${written.join(', ')}` : 'nada mudou');

if (warnings) {
  console.error(`\n${warnings} problema(s) de metadados encontrado(s).`);
  process.exit(1);
}
