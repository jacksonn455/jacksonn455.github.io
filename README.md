# Jackson Felipe Magnabosco - Portfolio

Welcome to my professional portfolio! I'm a passionate Software Engineer and Professor with expertise in full-stack development, data science, and artificial intelligence.

🌐 **Live Portfolio:** [jacksonmagnabosco.dev](https://jacksonmagnabosco.dev/)

## 👨‍💻 About Me

I'm a dedicated Software Engineer and University Professor with postgraduate studies in Software Engineering and Database Administration. Currently serving as a Senior Software Engineer with coding agent experience, I combine technical expertise with educational passion to create innovative solutions and share knowledge with the developer community.

### Professional Background

- **Senior Software Engineer** - Coding Agent Experience
- **Professor of Computer Science** - Integrated Regional University of Alto Uruguai and Missions
- **Course Creator** - Udemy and Hotmart Platforms
- **Specialist** - Web Development, Data Mining, UX/UI Design, and Artificial Intelligence

## 🚀 Core Skills & Technologies

### Programming Languages

![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/-Java-ED8B00?style=flat-square&logo=java&logoColor=white)
![R](https://img.shields.io/badge/-R-276DC3?style=flat-square&logo=r&logoColor=white)
![SQL](https://img.shields.io/badge/-SQL-4479A1?style=flat-square&logo=postgresql&logoColor=white)

### Frontend Development

- **Frameworks:** React.js, Next.js, Angular, Vue.js
- **Styling:** HTML5, CSS3, Sass, LESS, Bootstrap, Tailwind CSS
- **Tools:** jQuery, Webpack, Vite, Babel

### Backend Development

- **Node.js:** Express.js, NestJS
- **Java:** Spring Boot
- **APIs:** REST, GraphQL, WebSocket
- **Architecture:** Microservices, Serverless

### Databases & Cloud

- **Relational:** PostgreSQL, MySQL, SQL Server, Oracle
- **NoSQL:** MongoDB, Firebase, CouchDB, DynamoDB
- **Cloud Platforms:** AWS, Google Cloud, Azure
- **Infrastructure:** Docker, Kubernetes, Terraform

### DevOps & Testing

- **CI/CD:** GitHub Actions, Jenkins
- **Testing:** Jest, Mocha, Cypress, Selenium
- **Monitoring:** Elasticsearch, Redis
- **Message Queues:** RabbitMQ, Kafka

### Data Science & AI

- **Libraries:** TensorFlow, PyTorch, Scikit-learn, Pandas, NumPy
- **Visualization:** Matplotlib, Plotly, Power BI
- **Tools:** Jupyter Notebook, Google Colab, WEKA
- **AI Integration:** OpenAI API, LangChain, GPT-4

### UX/UI Design

- **Design Principles:** Human-Computer Interaction (HCI), User Experience, Accessibility
- **Tools:** Modern design thinking, usability testing
- **Focus:** Interface design and user-centered development

## 🎯 Expertise Areas

- **Full-Stack Web Development** - End-to-end application development
- **Software Architecture** - Scalable and maintainable system design
- **Data Mining & Analytics** - Knowledge Discovery in Databases (KDD)
- **Machine Learning & AI** - Intelligent system development
- **UX/UI Design** - User-centered interface design
- **Database Optimization** - Performance and scalability improvements
- **DevOps & Automation** - Streamlined development workflows
- **Technical Leadership** - Team guidance and mentoring

## 📚 Projects & Portfolio

This portfolio showcases a diverse range of projects including:

### Web Applications

- **E-commerce Solutions** - Full-featured online marketplaces
- **Digital Auction Systems** - Real-time bidding platforms
- **Progressive Web Apps** - Modern, responsive web applications

### Data Science Projects

- **Data Mining Applications** - Knowledge discovery and pattern recognition
- **Machine Learning Models** - Predictive analytics and intelligent systems
- **Business Intelligence** - Data visualization and reporting solutions

### Educational Content

- **Course Development** - Comprehensive programming and technology courses
- **Technical Workshops** - Hands-on learning experiences
- **IoT Projects** - Internet of Things practical implementations

### Software Engineering

- **System Architecture** - Scalable and maintainable designs
- **Performance Optimization** - High-performance application development
- **Process Automation** - Workflow and business process automation

## Education & Certifications

- **Postgraduate** - Software Engineering
- **Postgraduate** - Database Administration
- **Continuous Learning** - Active in platforms like Coursera, Pluralsight, and various technology conferences

## 📈 Professional Experience Highlights

- **Code Review & Architecture** - Design and implementation of robust software solutions
- **Testing Methodologies** - Comprehensive testing strategies and quality assurance
- **Agile Methodologies** - Scrum, Kanban, and XP implementation
- **Technical Leadership** - Team guidance and technical decision making
- **Performance Optimization** - System scalability and efficiency improvements

## 🛠 About This Site

Built with **vanilla HTML, CSS and JavaScript - zero frameworks, zero runtime
dependencies, zero third-party requests.** Every asset is self-hosted.

| Lighthouse | Performance | Accessibility | Best Practices | SEO |
| ---------- | ----------- | ------------- | -------------- | --- |
| Desktop    | 100         | 100           | 100            | 100 |
| Mobile     | 97          | 100           | 100            | 100 |

**74 KiB** transferred on first load · **LCP 0.4 s** desktop / 1.6 s mobile · CLS 0.007

### Features

- Three languages (EN / PT / ES) — English is written into the HTML, PT and ES
  ship as inline JSON. **No fetch, so switching works over `file://`, offline
  and under a strict CSP**
- Renders completely **with JavaScript disabled** — the script only enhances
- Light / dark theme following the OS, with a manual override
- WCAG 2.1 AA: single `<h1>`, keyboard-navigable accordions, focus states,
  `prefers-reduced-motion`, contrast verified in both themes
- All images WebP, lazy-loaded, with intrinsic `width`/`height`
- YouTube embeds behind click-to-load facades — no tracking until requested
- Language detected from `navigator.language`; **no IP geolocation, no cookies,
  no analytics, no data leaves the browser**
- **12 indexable pages generated from one JSON file** (plus a noindex 404), each with unique title,
  description, canonical and JSON-LD (`Course`, `FAQPage`, `BreadcrumbList`,
  `ItemList`, `ProfilePage`, `WebSite`)
- `llms.txt` and an explicit `robots.txt` for AI search engines (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended and friends)

### Project structure

```
index.html                 the home page, self-contained and trilingual
cursos/index.html          course catalogue (generated)
cursos/<slug>/index.html   one page per course (generated)
afiliados/index.html       Hotmart affiliate program (generated)
404.html                   custom error page (generated, noindex)
sitemap.xml  llms.txt      generated
robots.txt                 crawl policy, incl. AI crawlers
data/
  courses.json             SINGLE SOURCE OF TRUTH for every course
assets/
  css/main.css             design system: tokens, components, light+dark
  js/app.js                i18n, theme, nav, accordion, lightbox, facades
  i18n/{en,pt,es}.json     translation sources — edit these, then npm run build
  img/                     WebP images
  social/                  1200x630 Open Graph cards (npm run og)
  files/                   CV and certificates (PDF)
scripts/
  build-i18n.js            writes EN into the HTML, inlines PT/ES
  build-pages.js           renders /cursos, /afiliados, 404, sitemap, llms.txt
                           and the home JSON-LD graph, all from courses.json
  build-og-image.js        renders the social cards with sharp  (npm run og)
  serve.js                 local dev server (gzip, 404, mirrors GitHub Pages)
  optimize-images.js       resize + WebP conversion for new images
  check-links.js           JS syntax, links, anchors, metadata, JSON-LD,
                           sitemap coverage, i18n keys and a11y hygiene
```

> Editing a translation? Change `assets/i18n/*.json`, then run `npm run build`.
> Adding or changing a course? Change `data/courses.json`, then `npm run build`.
> The build is idempotent and CI fails if a generated file is out of sync.

**Content rule for `data/courses.json`:** never put a fact there that cannot be
verified — price, workload, star rating and student counts change per platform
and per promotion, and inventing them in structured data is how a site earns a
manual action. The `syllabus` entries come from the public product pages.

### URL strategy (read before touching a link)

Every internal link and asset path is **relative**, never `/absolute`. The
templates in `build-pages.js` are written with `/cursos/...` because it reads
better, and `layout()` rewrites them to `../` depth on output. This keeps the
site working when it is not at a domain root — `file://`, a preview in a
subfolder, a GitHub Pages _project_ site — and it still works at the root.

`404.html` is the single exception and keeps absolute paths: GitHub Pages serves
it for a missing path at _any_ depth (`/a/b/c` too) while the address bar stays
on the requested path, so a relative link there would point at nothing.
`npm run check` enforces both halves of this rule.

Absolute URLs stay absolute where they must be: `canonical`, `og:url`,
`og:image`, sitemap `<loc>` and JSON-LD `@id`.

One consequence of pretty URLs: over `file://` a link to `cursos/x/` opens a
directory listing, because only a server maps a directory to its `index.html`.
Use `npm run dev` to browse locally.

### Language split

The home page is trilingual (EN in the HTML, PT/ES swapped client-side). The
generated pages are **pt-BR only, on purpose**: the courses are taught in
Portuguese and the searches that bring a buyer (`curso de lógica de
programação`, `como ser afiliado hotmart`) are typed in Portuguese. Serving them
as static Portuguese HTML beats a client-side translation that a crawler only
sees after running JavaScript.

### Development

```bash
npm install
npm run dev        # http://localhost:4173
npm run build      # i18n + generated pages, sitemap and llms.txt
npm run check      # HTML validation + links + metadata + JSON-LD + a11y
npm run images     # optimize any newly added image
npm run og         # regenerate the 1200x630 social cards
npm run format     # prettier
npm run lighthouse # Lighthouse CI over 4 page templates, with thresholds
```

CI verifies that every generated file matches its source, validates the HTML of
all pages, runs the link/metadata/i18n checks, checks formatting and runs
Lighthouse on every push. Publishing is a push to `master` (GitHub Pages serves
the branch root).

## 🤝 Let's Connect

I'm always open to discussing new opportunities, collaborations, or just talking about technology!

- 🌐 **Website:** [jacksonmagnabosco.dev](https://jacksonmagnabosco.dev/)
- 💼 **LinkedIn:** [Connect with me](https://www.linkedin.com/in/jackson-felipe-magnabosco-b0a48798/)
- 📧 **Email:** [jacksonmagnabosco@hotmail.com](mailto:jacksonmagnabosco@hotmail.com)
- 🎓 **Udemy:** [View my courses](https://www.udemy.com/user/jackson-felipe-magnabosco/)
- 💰 **Affiliate program:** [Earn 40% per sale reselling my courses on Hotmart](https://jacksonmagnabosco.dev/#affiliates)

---

⭐ **If you find my work interesting, please consider giving this repository a star!**
