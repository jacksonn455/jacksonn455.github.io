
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

