function mostrarCarrito() {
  const carrito = leerCarrito();
  const lista = document.getElementById('lista-carrito');
  const totales = calcularTotales();

  if (carrito.length === 0) {
    lista.innerHTML =
      '<div class="vacio">' +
      dibujarGalleta('avena-canela', 'ninguna', 'mini') +
      '<h3>Todavía no hay galletas aquí</h3>' +
      '<p>Mira el catálogo y agrega las que quieras. El carrito se guarda en este navegador, ' +
      'así que puedes volver después.</p>' +
      '<a class="boton boton-naranja" href="catalogo.html">Ver el catálogo</a>' +
      ' <a class="boton boton-morado" href="personalizacion.html">Crear mi galleta</a>' +
      '</div>';

    document.getElementById('acciones').classList.add('oculto');
    document.getElementById('cuantas').classList.add('oculto');
    document.getElementById('boton-pedido').classList.add('oculto');
  } else {
    let html = '';

    for (let i = 0; i < carrito.length; i++) {
      const galleta = carrito[i];

      let imagen = dibujarGalleta(galleta.sabor, galleta.decoracion, galleta.tamano);
      if (galleta.foto) {
        imagen = '<img src="' + escapar(galleta.foto) + '" alt="">';
      }

      // Solo la galleta basica del personalizador se puede volver a personalizar,
      // las del catalogo ya vienen con sus topincs
      let botonPersonalizar = '';
      if (galleta.galleta === 'galleta-basica') {
        botonPersonalizar = '<button class="personalizar-linea" onclick="personalizar(' + i + ')">Personalizar</button>';
      }

      html +=
        '<div class="linea-carrito">' +
        '<div class="linea-carrito-dibujo">' +
        imagen +
        '</div>' +
        '<div>' +
        '<h3>' + escapar(galleta.nombre) + '</h3>' +
        '<p class="detalle">' + escapar(galleta.detalle) + '</p>' +
        '<p class="detalle">' + formatearPrecio(galleta.precio) + ' cada una</p>' +
        '</div>' +
        '<div class="linea-carrito-derecha">' +
        '<div class="contador-caja">' +
        '<button class="boton boton-chico" onclick="cambiar(' + i + ', -1)">-</button>' +
        '<span>' + galleta.cantidad + '</span>' +
        '<button class="boton boton-chico" onclick="cambiar(' + i + ', 1)">+</button>' +
        '</div>' +
        '<span class="precio">' + formatearPrecio(galleta.precio * galleta.cantidad) + '</span>' +
        botonPersonalizar +
        '<button class="quitar" onclick="quitar(' + i + ')">Quitar</button>' +
        '</div>' +
        '</div>';
    }

    lista.innerHTML = html;
    document.getElementById('acciones').classList.remove('oculto');
    document.getElementById('cuantas').classList.remove('oculto');
    document.getElementById('boton-pedido').classList.remove('oculto');
    document.getElementById('cuantas').textContent = totales.cantidad + ' galletas';
  }

  let regalo = '';

  if (totales.regalo === true) {
    regalo =
      '<div class="linea-recibo"><span>&#127873; Galleta de regalo (4x5)</span><span class="puntos"></span>' +
      '<b>Gratis</b></div>';
  } else if (totales.cantidad > 0) {
    const faltan = GALLETAS_PARA_REGALO - totales.soloGalletas;
    let frase = 'Te faltan ' + faltan + ' galletas';
    if (faltan === 1) {
      frase = 'Te falta 1 galleta';
    }
    regalo =
      '<div class="linea-recibo"><span>' + frase +
      ' para la galleta de regalo</span><span class="puntos"></span><b>4x5</b></div>';
  }

  document.getElementById('resumen').innerHTML =
    '<h2>Resumen</h2>' +
    '<div class="linea-recibo"><span>' + totales.cantidad + ' galletas</span>' +
    '<span class="puntos"></span><b>' + formatearPrecio(totales.subtotal) + '</b></div>' +
    regalo +
    '<div class="total"><span>Total</span><span>' + formatearPrecio(totales.total) + '</span></div>';
}

function cambiar(posicion, cuanto) {
  cambiarCantidad(posicion, cuanto);
  mostrarCarrito();
}

function quitar(posicion) {
  quitarDelCarrito(posicion);
  mostrarCarrito();
  mostrarAviso('Galleta retirada del carrito.', 'bien');
}

// Manda una sola galleta (o varias) de esta linea al personalizador.
// Las demas unidades de la linea se quedan en el carrito tal como estan.
function personalizar(posicion) {
  const carrito = leerCarrito();
  const galleta = carrito[posicion];

  const guardo = guardarPersonalizacionPendiente({
    clave: galleta.clave,
    nombre: galleta.nombre,
    maximo: galleta.cantidad,
    topincs: galleta.topincs,
    extras: galleta.extras,
  });

  if (guardo === true) {
    window.location.href = 'personalizacion.html?editar=1';
  }
}

// Cuando volvemos del personalizador avisamos como quedo la cosa.
function avisoDeRegreso() {
  const direccion = window.location.search;

  if (direccion.indexOf('personalizadas=') === -1) {
    return;
  }

  const cuantas = Number(direccion.split('personalizadas=')[1].replace(/[^0-9]/g, ''));

  if (cuantas > 0) {
    let texto = cuantas + ' galletas quedaron personalizadas';

    if (cuantas === 1) {
      texto = '1 galleta quedó personalizada';
    }

    mostrarAviso(texto + '. Las demás siguen igual.', 'bien');
  }

  history.replaceState({}, '', 'carrito.html');
}

function vaciar() {
  const seguro = confirm('¿Seguro que quieres vaciar el carrito?');

  if (seguro === true) {
    vaciarCarrito();
    mostrarCarrito();
    mostrarAviso('El carrito quedó vacío.', 'bien');
  }
}

mostrarCarrito();
avisoDeRegreso();
