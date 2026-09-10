const WHATSAPP = '3133784021';

function prepararPagina() {
  const carrito = leerCarrito();

  if (carrito.length === 0) {
    document.getElementById('pedido-formulario').classList.add('oculto');
    document.getElementById('pedido-vacio').classList.remove('oculto');
    return;
  }

  mostrarResumen(carrito);
}

function mostrarResumen(carrito) {
  const totales = calcularTotales();
  let html = '<h2>Tu pedido</h2>';

  for (let i = 0; i < carrito.length; i++) {
    html +=
      '<div class="linea-recibo">' +
      '<span>' + carrito[i].cantidad + ' x ' + escapar(carrito[i].nombre) + '</span>' +
      '<span class="puntos"></span>' +
      '<b>' + formatearPrecio(carrito[i].precio * carrito[i].cantidad) + '</b>' +
      '</div>';
  }

  if (totales.descuento > 0) {
    html +=
      '<div class="linea-recibo"><span>Docena mágica</span><span class="puntos"></span>' +
      '<b>- ' + formatearPrecio(totales.descuento) + '</b></div>';
  }

  html += '<div class="total"><span>Total</span><span>' + formatearPrecio(totales.total) + '</span></div>';

  document.getElementById('resumen-pedido').innerHTML = html;
}

function marcarError(campo, mensaje) {
  document.getElementById('error-' + campo).textContent = mensaje;

  const caja = document.getElementById(campo);
  if (caja !== null) {
    caja.parentElement.classList.add('malo');
  }
}

function borrarErrores() {
  const errores = document.querySelectorAll('.error');
  for (let i = 0; i < errores.length; i++) {
    errores[i].textContent = '';
  }

  const campos = document.querySelectorAll('.campo');
  for (let i = 0; i < campos.length; i++) {
    campos[i].classList.remove('malo');
  }
}

function datosCorrectos() {
  borrarErrores();
  let todoBien = true;

  const nombre = limpiarTexto(document.getElementById('nombre').value, 60);
  const curso = limpiarTexto(document.getElementById('curso').value, 6);
  const celular = document.getElementById('celular').value.replace(/\D/g, '');
  const notas = document.getElementById('notas').value;

  if (nombre.length < 3) {
    marcarError('nombre', 'Escribe tu nombre completo.');
    todoBien = false;
  } else if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(nombre) === false) {
    marcarError('nombre', 'El nombre solo puede tener letras.');
    todoBien = false;
  }

  if (/^(6|7|8|9|10|11)[-\s]?[A-Za-z]?$/.test(curso) === false) {
    marcarError('curso', 'Escribe el curso así: 1104, 1004 o 903, etc.');
    todoBien = false;
  }

  if (celular !== '' && /^3\d{9}$/.test(celular) === false) {
    marcarError('celular', 'El celular debe tener 10 números y empezar por 3.');
    todoBien = false;
  }

  if (document.querySelector('input[name="lugar"]:checked') === null) {
    marcarError('lugar', 'Escoge un lugar de entrega.');
    todoBien = false;
  }

  if (document.querySelector('input[name="momento"]:checked') === null) {
    marcarError('momento', 'Escoge a qué hora te lo entregamos.');
    todoBien = false;
  }

  if (document.querySelector('input[name="pago"]:checked') === null) {
    marcarError('pago', 'Escoge cómo vas a pagar.');
    todoBien = false;
  }

  if (notas.length > 200) {
    marcarError('notas', 'Las indicaciones no pueden pasar de 200 caracteres.');
    todoBien = false;
  }

  return todoBien;
}

function crearCodigo() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';

  for (let i = 0; i < 4; i++) {
    const azar = Math.floor(Math.random() * letras.length);
    codigo = codigo + letras[azar];
  }

  return 'MC-' + codigo;
}

function enviarPedido(evento) {
  evento.preventDefault();

  if (datosCorrectos() === false) {
    mostrarAviso('Revisa los datos marcados en rojo.', 'mal');
    return;
  }

  const carrito = leerCarrito();
  const totales = calcularTotales();

  const pedido = {
    codigo: crearCodigo(),
    fecha: new Date().toLocaleString('es-CO'),
    nombre: limpiarTexto(document.getElementById('nombre').value, 60),
    curso: limpiarTexto(document.getElementById('curso').value, 6).toUpperCase(),
    celular: document.getElementById('celular').value.replace(/\D/g, ''),
    notas: limpiarTexto(document.getElementById('notas').value, 200),
    lugar: document.querySelector('input[name="lugar"]:checked').dataset.nombre,
    momento: document.querySelector('input[name="momento"]:checked').dataset.nombre,
    pago: document.querySelector('input[name="pago"]:checked').dataset.nombre,
    galletas: carrito,
    total: totales.total,
  };

  guardarPedido(pedido);
  vaciarCarrito();
  mostrarConfirmacion(pedido);
  mostrarAviso('Pedido ' + pedido.codigo + ' registrado.', 'bien');
}

function guardarPedido(pedido) {
  let pedidos = [];
  const guardados = localStorage.getItem(CLAVE_PEDIDOS);

  if (guardados !== null) {
    pedidos = JSON.parse(guardados);
  }

  pedidos.unshift(pedido);
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos.slice(0, 10)));
}

function mostrarConfirmacion(pedido) {
  let notas = '';
  if (pedido.notas !== '') {
    notas =
      '<div class="linea-recibo"><span>Indicaciones</span><span class="puntos"></span>' +
      '<b>' + escapar(pedido.notas) + '</b></div>';
  }

  const texto =
    'Hola Magic Cookies, soy ' + pedido.nombre + ' de ' + pedido.curso + '. ' +
    'Mi pedido es el ' + pedido.codigo + ', para entregar en ' + pedido.lugar +
    ' (' + pedido.momento + '). Total: ' + formatearPrecio(pedido.total) + '.';

  const enlace = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto);

  document.getElementById('confirmacion').innerHTML =
    '<div class="chulo">&#10003;</div>' +
    '<h1>¡Pedido registrado!</h1>' +
    '<p class="texto-guia" style="margin: 10px auto">Guarda este código y muéstralo cuando recibas tus galletas. ' +
    'Confírmanos por WhatsApp para empezar a hornear.</p>' +
    '<p class="codigo">' + pedido.codigo + '</p>' +
    '<div class="recibo">' +
    '<h3>Detalle del pedido</h3>' +
    linea('Estudiante', escapar(pedido.nombre)) +
    linea('Curso', escapar(pedido.curso)) +
    linea('Lugar', pedido.lugar) +
    linea('Entrega', pedido.momento) +
    linea('Pago', pedido.pago) +
    linea('Fecha', pedido.fecha) +
    notas +
    '<div class="total"><span>Total</span><span>' + formatearPrecio(pedido.total) + '</span></div>' +
    '</div>' +
    '<div class="confirmacion-botones">' +
    '<a class="boton boton-naranja boton-grande" href="' + enlace + '" target="_blank">Confirmar por WhatsApp</a>' +
    '<button class="boton" onclick="window.print()">Imprimir</button>' +
    '<a class="boton" href="catalogo.html">Pedir más galletas</a>' +
    '</div>' +
    '<p class="texto-suave texto-chico">Este pedido quedó guardado solo en este navegador.</p>';

  document.getElementById('pedido-formulario').classList.add('oculto');
  document.getElementById('pedido-listo').classList.remove('oculto');
  window.scrollTo(0, 0);
}

function linea(titulo, valor) {
  return '<div class="linea-recibo"><span>' + titulo + '</span><span class="puntos"></span><b>' + valor + '</b></div>';
}

document.getElementById('formulario-pedido').addEventListener('submit', enviarPedido);
prepararPagina();
