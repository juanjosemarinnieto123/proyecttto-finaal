function sinTildes(texto) {
  return texto
    .toLowerCase()
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
}

function mostrarGalletas() {
  const categoria = document.querySelector('input[name="categoria"]:checked').value;

  const busqueda = sinTildes(document.getElementById('buscador').value.trim());

  let html = '';
  let encontradas = 0;

  for (let i = 0; i < GALLETAS.length; i++) {
    const galleta = GALLETAS[i];
    const textoGalleta = sinTildes(galleta.nombre + ' ' + galleta.descripcion + ' ' + galleta.etiquetas.join(' '));

    const pasaCategoria = categoria === 'todas' || galleta.categoria === categoria;
    const pasaBusqueda = busqueda === '' || textoGalleta.indexOf(busqueda) !== -1;

    if (pasaCategoria && pasaBusqueda) {
      html += crearTarjeta(galleta);
      encontradas = encontradas + 1;
    }
  }

  const lista = document.getElementById('lista-galletas');

  if (encontradas === 0) {
    lista.classList.remove('rejilla-galletas');
    lista.innerHTML =
      '<div class="vacio">' +
      '<h3>No encontramos esa galleta</h3>' +
      '<p>Prueba con otra palabra o mira todas las categorías.</p>' +
      '<a class="boton boton-morado" href="personalizacion.html">Crear mi galleta</a>' +
      '</div>';
  } else {
    lista.classList.add('rejilla-galletas');
    lista.innerHTML = html;
  }

  document.getElementById('cuantas').textContent = encontradas + ' galletas en esta selección';
}

const filtros = document.querySelectorAll('input[name="categoria"]');
for (let i = 0; i < filtros.length; i++) {
  filtros[i].addEventListener('change', mostrarGalletas);
}

document.getElementById('buscador').addEventListener('input', mostrarGalletas);

mostrarGalletas();
