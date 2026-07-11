$( document ).ready(function() {
function typeWrite(elemento){
    const textoArray = elemento.innerHTML.split('');
    elemento.innerHTML = ' ';
    textoArray.forEach(function(letra, i){   
      
    setTimeout(function(){
        elemento.innerHTML += letra;
    }, 230 * i)

  });
}

const nomeTitulo = document.querySelector('#animacao');

typeWrite(nomeTitulo)



// Lightweight, dependable carousel for Recommendations section
;(function(){
  var $wrap = $('#carousel-recommendations');
  if (!$wrap.length) return;
  var $items = $wrap.find('.carousel-inner > .item');
  var $indicators = $wrap.find('.carousel-indicators li');
  var current = $items.filter('.active').index();
  if (current < 0) current = 0;
  var interval = parseInt($wrap.data('interval') || $wrap.data('bs-interval') || 15000, 10);
  var timer = null;

  function show(index){
    index = (index + $items.length) % $items.length;
    $items.removeClass('active');
    $items.eq(index).addClass('active');
    $indicators.removeClass('active');
    $indicators.eq(index).addClass('active');
    current = index;
  }

  function next(){ show(current+1); }
  function prev(){ show(current-1); }

  $wrap.on('click', '.left.carousel-control', function(e){ e.preventDefault(); stopAuto(); prev(); restartAuto(); });
  $wrap.on('click', '.right.carousel-control', function(e){ e.preventDefault(); stopAuto(); next(); restartAuto(); });
  $indicators.on('click', function(){ var i = $(this).index(); stopAuto(); show(i); restartAuto(); });

  function startAuto(){ if (timer) return; timer = setInterval(next, interval); }
  function stopAuto(){ if (!timer) return; clearInterval(timer); timer = null; }
  function restartAuto(){ stopAuto(); startAuto(); }

  $wrap.on('mouseenter', stopAuto); $wrap.on('mouseleave', startAuto);

  // initialize
  $items.css('display','block'); // controlled by CSS opacity for fade
  show(current);
  startAuto();
})();

});