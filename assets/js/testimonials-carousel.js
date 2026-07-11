/* TestimonialsCarousel - vanilla JS component
   Usage: include this script and call TestimonialsCarousel.init(selector, data, options)
*/
(function(){
  const defaultOptions = {autoplay:true, interval:5500, loop:true}

  function createCard(item){
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    // store translations as data attributes if provided
    const en = item.texto && item.texto.en ? item.texto.en : (item.texto || '');
    const pt = item.texto && item.texto.pt ? item.texto.pt : (item.texto || '');
    const es = item.texto && item.texto.es ? item.texto.es : (item.texto || '');
    const display = (window.i18next && window.i18next.language) ? (window.i18next.language === 'pt' ? pt : (window.i18next.language === 'es' ? es : en)) : en;
    card.innerHTML = `
      <div class="quote-icon">“</div>
      <div class="testimonial-text" data-text-en="${escapeHtml(en)}" data-text-pt="${escapeHtml(pt)}" data-text-es="${escapeHtml(es)}">${escapeHtml(display)}</div>
      <div class="divider" aria-hidden="true"></div>
      <div class="testimonial-footer">
        <div class="person">
          <a class="avatar-link" href="${item.linkedin||'#'}" target="_blank" rel="noopener noreferrer"><img class="avatar" src="${item.avatar||'https://via.placeholder.com/150'}" alt="${item.nome} avatar"></a>
          <div>
            <div class="person-name">${item.nome}</div>
            <div class="person-role">${item.cargo}</div>
          </div>
        </div>
        <a class="linkedin-btn" href="${item.linkedin||'#'}" aria-label="LinkedIn profile of ${item.nome}" target="_blank" rel="noopener noreferrer">in</a>
      </div>
    `;
    return card;
  }

  // basic html escape for injecting attributes/text safely
  function escapeHtml(str){
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  function init(selector, data, opts){
    const options = Object.assign({}, defaultOptions, opts||{});
    const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if(!root) return console.warn('TestimonialsCarousel root not found', selector);

    // build DOM
    root.classList.add('testimonials-section');
    const container = document.createElement('div'); container.className='testimonials-container';
    const viewport = document.createElement('div'); viewport.className='carousel-viewport';
    const track = document.createElement('div'); track.className='testimonials-track';
    data.forEach(item=>track.appendChild(createCard(item)));
    viewport.appendChild(track);
    container.appendChild(viewport);

    // controls (only dots — arrows intentionally removed to avoid duplicate navigation)
    const controls = document.createElement('div'); controls.className='controls';
    const dots = document.createElement('div'); dots.className='dots';
    controls.appendChild(dots);
    container.appendChild(controls);
    root.appendChild(container);

    // state
    let index=0; let autoplayTimer=null; const slides = Array.from(track.children);

    function render(){
      const perView = window.innerWidth>=900?3:1;
      // clamp index for looping
      if(options.loop){
        if(index<0) index = slides.length-1;
        if(index>=slides.length) index = 0;
      } else {
        index = Math.max(0, Math.min(index, slides.length-perView));
      }
      const offset = index * (slides[0].getBoundingClientRect().width + 20);
      track.style.transform = `translateX(-${offset}px)`;
      // dots
      dots.innerHTML='';
      const pages = Math.max(1, Math.ceil(slides.length / perView));
      for(let i=0;i<pages;i++){
        const d=document.createElement('button'); d.className='dot'; d.setAttribute('aria-label',`Go to slide ${i+1}`);
        if(i===Math.floor(index/perView)) d.classList.add('active');
        d.addEventListener('click',()=>{ index = i*perView; render(); resetAutoplay(); });
        dots.appendChild(d);
      }
    }

    function next(){ index++; render(); }
    function prev(){ index--; render(); }

    // autoplay
    function startAutoplay(){ if(!options.autoplay) return; stopAutoplay(); autoplayTimer = setInterval(()=>{ next(); }, options.interval); }
    function stopAutoplay(){ if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer=null; } }
    function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

    // pause on hover / touch
    [root, track].forEach(el=>{
      el.addEventListener('mouseenter', ()=>{ stopAutoplay(); });
      el.addEventListener('mouseleave', ()=>{ startAutoplay(); });
      el.addEventListener('touchstart', ()=>{ stopAutoplay(); }, {passive:true});
      el.addEventListener('touchend', ()=>{ startAutoplay(); });
    });

    // accessibility: respect prefers-reduced-motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(reduce.matches) { stopAutoplay(); }
    reduce.addEventListener && reduce.addEventListener('change', ()=>{ if(reduce.matches) stopAutoplay(); else startAutoplay(); });

    // swipe support
    let startX=0, dx=0;
    track.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
    track.addEventListener('touchmove', (e)=>{ dx = e.touches[0].clientX - startX; }, {passive:true});
    track.addEventListener('touchend', ()=>{ if(Math.abs(dx)>40){ if(dx<0) next(); else prev(); } dx=0; resetAutoplay(); });

    window.addEventListener('resize', ()=>{ render(); });

    // Update texts when language changes (if i18next is present)
    if(window.i18next && window.i18next.on){
      i18next.on('languageChanged', function(lang){
        // update testimonial texts and person info from data attributes
        slides.forEach(slide=>{
          const txt = slide.querySelector('.testimonial-text');
          if(txt){
            const val = (lang==='pt') ? txt.dataset.textPt : (lang==='es' ? txt.dataset.textEs : txt.dataset.textEn);
            if(val!==undefined) txt.textContent = val;
          }
          const pname = slide.querySelector('.person-name');
          if(pname){
            const dataName = pname.dataset;
            const val = (lang==='pt') ? dataName.namePt : (lang==='es' ? dataName.nameEs : dataName.nameEn);
            if(val) pname.textContent = val;
          }
          const prole = slide.querySelector('.person-role');
          if(prole){
            const dataRole = prole.dataset;
            const val = (lang==='pt') ? dataRole.rolePt : (lang==='es' ? dataRole.roleEs : dataRole.roleEn);
            if(val) prole.textContent = val;
          }
        });
        render();
      });
    }

    // init
    render(); startAutoplay();

    return {next, prev, start: startAutoplay, stop: stopAutoplay, render};
  }

  window.TestimonialsCarousel = { init };
})();
