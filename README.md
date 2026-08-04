# Jackson Felipe Magnabosco - Portfolio

Welcome to my professional portfolio! I'm a passionate Software Engineer and Professor with expertise in full-stack development, data science, and artificial intelligence.

🌐 **Live Portfolio:** [jacksonmagnabosco.dev](https://jacksonmagnabosco.dev/)

## 👨‍💻 About Me

I'm a dedicated Software Engineer and University Professor with postgraduate studies in Software Engineering and Database Administration. Currently serving as a Senior Software Engineer with coding agent experience, I combine technical expertise with educational passion to create innovative solutions and share knowledge with the developer community.

### Professional Background

- **Senior Software Engineer** - Coding Agent Experience
- **Professor of Computer Science** - Integrated Regional University of Alto Uruguai and Missions
- **Course Creator** - Udemy Platform
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

### Project structure

```
index.html                 the whole page, self-contained
assets/
  css/main.css             design system: tokens, components, light+dark
  js/app.js                i18n, theme, nav, accordion, lightbox, facades
  i18n/{en,pt,es}.json     translation sources — edit these, then npm run build
  img/                     WebP images
  files/                   CV and certificates (PDF)
scripts/
  build-i18n.js            writes EN into the HTML, inlines PT/ES  (npm run build)
  serve.js                 local dev server (gzip, mirrors GitHub Pages)
  optimize-images.js       resize + WebP conversion for new images
  check-links.js           JS syntax, assets, i18n keys and a11y hygiene
```

> Editing a translation? Change `assets/i18n/*.json`, then run `npm run build`
> to propagate it into `index.html`. The build is idempotent.

### Development

```bash
npm install
npm run dev        # http://localhost:4173
npm run check      # HTML validation + links + i18n keys + a11y hygiene
npm run images     # optimize any newly added image
npm run format     # prettier
npm run lighthouse # Lighthouse CI with score thresholds
```

CI runs validation, link/i18n checks, formatting and Lighthouse on every push,
then deploys to GitHub Pages.

## 🤝 Let's Connect

I'm always open to discussing new opportunities, collaborations, or just talking about technology!

- 🌐 **Website:** [jacksonmagnabosco.dev](https://jacksonmagnabosco.dev/)
- 💼 **LinkedIn:** [Connect with me](https://www.linkedin.com/in/jackson-felipe-magnabosco-b0a48798/)
- 📧 **Email:** [jacksonmagnabosco@hotmail.com](mailto:jacksonmagnabosco@hotmail.com)
- 🎓 **Udemy:** [View my courses](https://www.udemy.com/user/jackson-felipe-magnabosco/)

---

⭐ **If you find my work interesting, please consider giving this repository a star!**
