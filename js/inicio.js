// En la portada ahora va el banner de Magic Cookies, ya no las galletas dibujadas:
// document.getElementById('galleta-1').innerHTML = dibujarGalleta('chispas-chocolate', 'ninguna', 'gigante');
// document.getElementById('galleta-2').innerHTML = dibujarGalleta('red-velvet', 'corazon', 'clasica');
// document.getElementById('galleta-3').innerHTML = dibujarGalleta('vainilla-confeti', 'grageas', 'clasica');

// En la franja de personalizacion va la galleta basica, la misma del personalizador
document.getElementById('galleta-ejemplo').innerHTML =
  dibujarGalleta(GALLETA_BASICA.sabor, GALLETA_BASICA.decoracion, 'gigante');

let html = '';
let cuantas = 0;

for (let i = 0; i < GALLETAS.length; i++) {
  if (GALLETAS[i].favorita === true && cuantas < 3) {
    html += crearTarjeta(GALLETAS[i]);
    cuantas = cuantas + 1;
  }
}

document.getElementById('favoritas').innerHTML = html;
