/* ==========================================================================
   Jackson F. Magnabosco - Portfolio
   JavaScript unico, sem dependencias. Substitui jQuery, Bootstrap 3,
   i18next, i18next-browser-languagedetector e os 5 scripts anteriores.
   ========================================================================== */
(() => {
  'use strict';

  const SUPPORTED = ['en', 'pt', 'es'];
  const FALLBACK = 'en';
  const STORE_LANG = 'preferredLanguage';
  const STORE_THEME = 'preferredTheme';

  // uma traducao so precisa do parser de HTML se contiver tag ou entidade
  const HAS_MARKUP = /[<&]/;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Tema (claro / escuro / automatico)
     ------------------------------------------------------------------------ */
  const Theme = {
    init() {
      this.btn = $('[data-theme-toggle]');
      if (!this.btn) return;
      this.btn.addEventListener('click', () => this.toggle());
      this.sync();
    },

    current() {
      return document.documentElement.dataset.theme || 'auto';
    },

    resolved() {
      const t = this.current();
      if (t !== 'auto') return t;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    toggle() {
      const next = this.resolved() === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(STORE_THEME, next);
      } catch {
        /* modo privado */
      }
      this.sync();
    },

    sync() {
      if (!this.btn) return;
      const dark = this.resolved() === 'dark';
      this.btn.setAttribute('aria-pressed', String(dark));
      $$('[data-theme-icon]', this.btn).forEach((icon) => {
        icon.hidden = icon.dataset.themeIcon !== (dark ? 'dark' : 'light');
      });
    },
  };

  /* ------------------------------------------------------------------------
     i18n

     O ingles ja esta escrito no HTML (scripts/build-i18n.js) e e capturado no
     boot como dicionario base. pt/es vem de blocos <script type="application/
     json"> embutidos na propria pagina. Sem fetch: funciona em file://, offline
     e sob CSP restritiva, e a pagina nunca aparece com secoes vazias mesmo se
     o JavaScript falhar.
     ------------------------------------------------------------------------ */
  const I18n = {
    dict: {},
    lang: FALLBACK,
    base: Object.create(null), // ingles capturado do DOM, chave -> valor
    bundles: Object.create(null),

    /* Captura o conteudo original em ingles antes de qualquer substituicao. */
    snapshot() {
      $$('[data-i18n]').forEach((el) => {
        const key = el.dataset.i18n;
        if (!(key in this.base)) this.base[key] = el.innerHTML;
      });

      $$('[data-i18n-attr]').forEach((el) => {
        el.dataset.i18nAttr.split(',').forEach((pair) => {
          const [attr, key] = pair.split(':').map((s) => s.trim());
          if (!attr || !key || key in this.base) return;
          const current = el.getAttribute(attr);
          if (current != null) this.base[key] = current;
        });
      });

      this.base.metaTitle = document.title;
      const descEl = $('meta[name="description"]');
      if (descEl) this.base.metaDescription = descEl.getAttribute('content');
    },

    /* Le os bundles pt/es embutidos na pagina. */
    readBundles() {
      $$('script[data-i18n-bundle]').forEach((tag) => {
        const lang = tag.dataset.i18nBundle;
        try {
          this.bundles[lang] = JSON.parse(tag.textContent);
        } catch (err) {
          console.error(`i18n: bundle "${lang}" invalido`, err);
        }
      });
    },

    detect() {
      const fromQuery = new URLSearchParams(location.search).get('lang');
      if (SUPPORTED.includes(fromQuery)) return fromQuery;

      let saved = null;
      try {
        saved = localStorage.getItem(STORE_LANG);
      } catch {
        /* ignore */
      }
      if (SUPPORTED.includes(saved)) return saved;

      // navigator.language e instantaneo, preciso e nao vaza o IP do visitante
      for (const tag of navigator.languages || [navigator.language || '']) {
        const base = String(tag).toLowerCase().split('-')[0];
        if (SUPPORTED.includes(base)) return base;
      }
      return FALLBACK;
    },

    get(key, dict = this.dict) {
      return key.split('.').reduce((acc, part) => (acc == null ? acc : acc[part]), dict);
    },

    t(key) {
      const value = this.get(key);
      if (value != null) return value;
      // chave ausente no idioma escolhido cai para o ingles do proprio HTML
      return key in this.base ? this.base[key] : null;
    },

    apply() {
      // A maioria das traducoes e texto puro. Usar textContent nesses casos evita
      // acionar o parser de HTML ~280 vezes e derruba o bloqueio da thread principal.
      $$('[data-i18n]').forEach((el) => {
        const value = this.t(el.dataset.i18n);
        if (value == null) return;
        if (HAS_MARKUP.test(value)) el.innerHTML = value;
        else if (el.textContent !== value) el.textContent = value;
      });

      // atributos: data-i18n-attr="alt:key, aria-label:outraKey"
      $$('[data-i18n-attr]').forEach((el) => {
        el.dataset.i18nAttr.split(',').forEach((pair) => {
          const [attr, key] = pair.split(':').map((s) => s.trim());
          if (!attr || !key) return;
          const value = this.t(key);
          if (value != null) el.setAttribute(attr, value);
        });
      });

      document.documentElement.lang = this.lang;

      const title = this.t('metaTitle');
      if (title) document.title = title;

      const desc = this.t('metaDescription');
      const descEl = $('meta[name="description"]');
      if (desc && descEl) descEl.setAttribute('content', desc);

      $$('[data-lang-option]').forEach((btn) => {
        btn.setAttribute('aria-current', String(btn.dataset.langOption === this.lang));
      });

      const label = $('[data-lang-current]');
      if (label) label.textContent = this.lang.toUpperCase();

      document.dispatchEvent(new CustomEvent('languagechange', { detail: this.lang }));
    },

    set(lang, persist = true) {
      if (!SUPPORTED.includes(lang)) lang = FALLBACK;
      // en nao tem bundle: o dicionario vazio faz tudo cair no base (o HTML)
      this.dict = lang === FALLBACK ? {} : this.bundles[lang] || {};
      this.lang = lang;

      if (persist) {
        try {
          localStorage.setItem(STORE_LANG, lang);
        } catch {
          /* modo privado */
        }
      }
      this.apply();
    },

    init() {
      this.snapshot();
      this.readBundles();
      this.set(this.detect(), false);

      $$('[data-lang-option]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.set(btn.dataset.langOption);
          LangMenu.close();
        });
      });
    },
  };

  /* ------------------------------------------------------------------------
     Menu de idiomas
     ------------------------------------------------------------------------ */
  const LangMenu = {
    init() {
      this.btn = $('[data-lang-toggle]');
      this.menu = $('[data-lang-menu]');
      if (!this.btn || !this.menu) return;

      this.btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.menu.hidden ? this.open() : this.close();
      });

      document.addEventListener('click', (e) => {
        if (!this.menu.hidden && !this.menu.contains(e.target)) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.menu.hidden) {
          this.close();
          this.btn.focus();
        }
      });
    },

    open() {
      if (!this.menu) return;
      this.menu.hidden = false;
      this.btn.setAttribute('aria-expanded', 'true');
    },

    close() {
      if (!this.menu || this.menu.hidden) return;
      this.menu.hidden = true;
      this.btn.setAttribute('aria-expanded', 'false');
    },
  };

  /* ------------------------------------------------------------------------
     Navegacao mobile + link ativo por secao
     ------------------------------------------------------------------------ */
  const Nav = {
    init() {
      this.toggle = $('[data-nav-toggle]');
      this.list = $('[data-nav-list]');
      this.mq = window.matchMedia('(max-width: 60rem)');

      if (this.toggle && this.list) {
        this.toggle.addEventListener('click', () => {
          this.list.hidden ? this.open() : this.close();
        });

        this.list.addEventListener('click', (e) => {
          if (e.target.closest('a') && this.mq.matches) this.close();
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && !this.list.hidden && this.mq.matches) {
            this.close();
            this.toggle.focus();
          }
        });

        this.mq.addEventListener('change', () => this.applyBreakpoint());
        this.applyBreakpoint();
      }

      this.spy();
    },

    applyBreakpoint() {
      if (!this.list) return;
      // no desktop a lista e sempre visivel; o atributo hidden so vale no mobile
      this.list.hidden = this.mq.matches;
      this.toggle?.setAttribute('aria-expanded', 'false');
    },

    open() {
      this.list.hidden = false;
      this.toggle.setAttribute('aria-expanded', 'true');
    },

    close() {
      if (!this.mq.matches) return;
      this.list.hidden = true;
      this.toggle.setAttribute('aria-expanded', 'false');
    },

    spy() {
      const links = $$('[data-nav-list] a[href^="#"]');
      if (!links.length || !('IntersectionObserver' in window)) return;

      const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
      const sections = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
      if (!sections.length) return;

      const visible = new Set();
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
          });
          const activeId = sections.map((s) => s.id).find((id) => visible.has(id));
          byId.forEach((link, id) => {
            link.setAttribute('aria-current', String(id === activeId));
          });
        },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
      );

      sections.forEach((s) => observer.observe(s));
    },
  };

  /* ------------------------------------------------------------------------
     Accordion acessivel (substitui o collapse do Bootstrap)
     ------------------------------------------------------------------------ */
  const Accordion = {
    init() {
      $$('[data-accordion]').forEach((group) => {
        const single = group.dataset.accordion === 'single';
        const triggers = $$('.accordion__trigger', group);

        triggers.forEach((trigger, index) => {
          const panel = document.getElementById(trigger.getAttribute('aria-controls'));
          if (!panel) return;

          trigger.addEventListener('click', () => {
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';
            if (single && !isOpen) {
              triggers.forEach((other) => {
                if (other !== trigger) this.setOpen(other, false);
              });
            }
            this.setOpen(trigger, !isOpen);
          });

          // navegacao por teclado entre cabecalhos (padrao WAI-ARIA)
          trigger.addEventListener('keydown', (e) => {
            const map = {
              ArrowDown: index + 1,
              ArrowUp: index - 1,
              Home: 0,
              End: triggers.length - 1,
            };
            if (!(e.key in map)) return;
            e.preventDefault();
            const next = (map[e.key] + triggers.length) % triggers.length;
            triggers[next].focus();
          });
        });
      });
    },

    setOpen(trigger, open) {
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (!panel) return;
      trigger.setAttribute('aria-expanded', String(open));
      panel.dataset.open = String(open);
      panel.hidden = false; // a animacao usa grid-template-rows, nao hidden
    },
  };

  /* ------------------------------------------------------------------------
     Lightbox das galerias (substitui os 9 carrosseis)
     ------------------------------------------------------------------------ */
  const Lightbox = {
    init() {
      this.dialog = $('[data-lightbox]');
      if (!this.dialog || typeof this.dialog.showModal !== 'function') return;

      this.img = $('[data-lightbox-img]', this.dialog);
      this.caption = $('[data-lightbox-caption]', this.dialog);
      this.counter = $('[data-lightbox-counter]', this.dialog);
      this.items = [];
      this.index = 0;

      // "ver todas": revela as miniaturas excedentes
      $$('[data-gallery-more]').forEach((more) => {
        more.addEventListener('click', () => {
          const target = document.getElementById(more.dataset.galleryMore);
          if (!target) return;
          const expanded = more.getAttribute('aria-expanded') === 'true';
          $$('[data-overflow]', target).forEach((li) => {
            li.hidden = expanded;
          });
          more.setAttribute('aria-expanded', String(!expanded));
        });
      });

      $$('[data-gallery]').forEach((gallery) => {
        const buttons = $$('.gallery__btn', gallery);
        buttons.forEach((btn, i) => {
          btn.addEventListener('click', () => {
            this.items = buttons.map((b) => {
              const image = $('img', b);
              return { src: image.currentSrc || image.src, alt: image.alt };
            });
            this.open(i);
          });
        });
      });

      $('[data-lightbox-close]', this.dialog)?.addEventListener('click', () => this.dialog.close());
      $('[data-lightbox-prev]', this.dialog)?.addEventListener('click', () => this.go(-1));
      $('[data-lightbox-next]', this.dialog)?.addEventListener('click', () => this.go(1));

      this.dialog.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.go(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.go(1);
        }
      });

      // clicar no fundo fecha
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog) this.dialog.close();
      });
    },

    open(index) {
      this.index = index;
      this.render();
      this.dialog.showModal();
    },

    go(delta) {
      if (!this.items.length) return;
      this.index = (this.index + delta + this.items.length) % this.items.length;
      this.render();
    },

    render() {
      const item = this.items[this.index];
      if (!item) return;
      this.img.src = item.src;
      this.img.alt = item.alt;
      if (this.caption) this.caption.textContent = item.alt;
      if (this.counter) {
        this.counter.textContent = `${this.index + 1} / ${this.items.length}`;
      }
      const multiple = this.items.length > 1;
      $('[data-lightbox-prev]', this.dialog)?.toggleAttribute('hidden', !multiple);
      $('[data-lightbox-next]', this.dialog)?.toggleAttribute('hidden', !multiple);
    },
  };

  /* ------------------------------------------------------------------------
     Facade do YouTube - o iframe so e criado no clique
     ------------------------------------------------------------------------ */
  const VideoFacade = {
    init() {
      $$('[data-video]').forEach((wrapper) => {
        const facade = $('.video__facade', wrapper);
        if (!facade) return;

        /* Nem todo video tem maxresdefault - cai para a miniatura garantida */
        const thumb = $('img[data-thumb-fallback]', facade);
        if (thumb) {
          const useFallback = () => {
            thumb.src = thumb.dataset.thumbFallback;
            delete thumb.dataset.thumbFallback;
          };
          if (thumb.complete && thumb.naturalWidth === 0) useFallback();
          else thumb.addEventListener('error', useFallback, { once: true });
        }

        facade.addEventListener(
          'click',
          () => {
            const id = wrapper.dataset.video;
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
            iframe.title = facade.dataset.title || 'YouTube video';
            iframe.allow =
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            wrapper.replaceChildren(iframe);
          },
          { once: true },
        );
      });
    },
  };

  /* ------------------------------------------------------------------------
     Maquina de escrever do hero
     ------------------------------------------------------------------------ */
  const Typewriter = {
    init() {
      this.el = $('[data-typewriter]');
      if (!this.el) return;

      this.render();
      document.addEventListener('languagechange', () => this.render());
    },

    render() {
      const raw = this.el.dataset.typewriter || this.el.textContent;
      // a fonte real do texto vem do i18n; guarda a lista de papeis
      const roles = (I18n.t('heroRoles') || raw || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean);
      if (!roles.length) return;

      clearTimeout(this.timer);

      if (prefersReducedMotion()) {
        this.el.textContent = roles[0];
        this.el.classList.add('is-done');
        return;
      }

      this.el.classList.remove('is-done');
      this.roles = roles;
      this.roleIndex = 0;
      this.charIndex = 0;
      this.deleting = false;
      this.tick();
    },

    tick() {
      const role = this.roles[this.roleIndex];
      this.charIndex += this.deleting ? -1 : 1;
      this.el.textContent = role.slice(0, this.charIndex);

      let delay = this.deleting ? 35 : 65;
      if (!this.deleting && this.charIndex === role.length) {
        delay = 2200;
        this.deleting = true;
      } else if (this.deleting && this.charIndex === 0) {
        this.deleting = false;
        this.roleIndex = (this.roleIndex + 1) % this.roles.length;
        delay = 400;
      }
      this.timer = setTimeout(() => this.tick(), delay);
    },
  };

  /* ------------------------------------------------------------------------
     Botao voltar ao topo
     ------------------------------------------------------------------------ */
  const ToTop = {
    init() {
      const btn = $('[data-to-top]');
      if (!btn) return;

      btn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        });
      });

      const sentinel = $('.hero') || document.body;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(
          ([entry]) => {
            btn.dataset.visible = String(!entry.isIntersecting);
          },
          { threshold: 0 },
        ).observe(sentinel);
      }
    },
  };

  /* ------------------------------------------------------------------------
     Bootstrap da aplicacao
     ------------------------------------------------------------------------ */
  const start = () => {
    Theme.init();
    LangMenu.init();
    Nav.init();
    Accordion.init();
    Lightbox.init();
    VideoFacade.init();
    ToTop.init();
    I18n.init();
    Typewriter.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
