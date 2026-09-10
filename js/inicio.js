document.getElementById('galleta-1').innerHTML = dibujarGalleta('chispas-chocolate', 'ninguna', 'gigante', '');
document.getElementById('galleta-2').innerHTML = dibujarGalleta('red-velvet', 'corazon', 'clasica', '');
document.getElementById('galleta-3').innerHTML = dibujarGalleta('vainilla-confeti', 'grageas', 'clasica', '');

// Personalizacion en pausa: dibujo de ejemplo de la seccion
// document.getElementById('galleta-ejemplo').innerHTML =
//   dibujarGalleta('doble-chocolate', 'glaseado', 'gigante', 'Feliz cumple');

let html = '';
let cuantas = 0;

for (let i = 0; i < GALLETAS.length; i++) {
  if (GALLETAS[i].favorita === true && cuantas < 3) {
    html += crearTarjeta(GALLETAS[i]);
    cuantas = cuantas + 1;
  }
}

document.getElementById('favoritas').innerHTML = html;
