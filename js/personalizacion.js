let cantidad = 1;

function opcionMarcada(nombreDelGrupo) {
  return document.querySelector('input[name="' + nombreDelGrupo + '"]:checked');
}

function calcularPrecio() {
  const sabor = opcionMarcada('sabor');
  const tamano = opcionMarcada('tamano');
  const decoracion = opcionMarcada('decoracion');
  const extras = document.querySelectorAll('input[name="extra"]:checked');

  let precio = Number(sabor.dataset.precio) * Number(tamano.dataset.factor);
  precio = precio + Number(decoracion.dataset.precio);

  for (let i = 0; i < extras.length; i++) {
    precio = precio + Number(extras[i].dataset.precio);
  }

  return Math.round(precio / 50) * 50;
}

function actualizar() {
  const sabor = opcionMarcada('sabor');
  const tamano = opcionMarcada('tamano');
  const decoracion = opcionMarcada('decoracion');

  const extras = document.querySelectorAll('input[name="extra"]:checked');
  let nombresExtras = '';
  let pideMensaje = false;

  for (let i = 0; i < extras.length; i++) {
    nombresExtras = nombresExtras + ' · ' + extras[i].dataset.nombre;

    if (extras[i].value === 'mensaje') {
      pideMensaje = true;
    }
  }

  const cajaMensaje = document.getElementById('caja-mensaje');
  const campoMensaje = document.getElementById('mensaje');

  if (pideMensaje === true) {
    cajaMensaje.classList.remove('oculto');
  } else {
    cajaMensaje.classList.add('oculto');
    campoMensaje.value = '';
  }

  const mensaje = limpiarTexto(campoMensaje.value, 25);
  document.getElementById('contador-letras').textContent = campoMensaje.value.length + '/25';

  const precio = calcularPrecio();

  document.getElementById('vista-previa').innerHTML =
    dibujarGalleta(sabor.value, decoracion.value, tamano.value, mensaje);

  document.getElementById('resumen').textContent =
    sabor.dataset.nombre + ' · ' + tamano.dataset.nombre + ' · ' + decoracion.dataset.nombre + nombresExtras;

  document.getElementById('precio-unidad').textContent = formatearPrecio(precio);
  document.getElementById('precio-total').textContent = formatearPrecio(precio * cantidad);
  document.getElementById('cantidad').textContent = cantidad;
}

function subirCantidad() {
  if (cantidad < 24) {
    cantidad = cantidad + 1;
    actualizar();
  }
}

function bajarCantidad() {
  if (cantidad > 1) {
    cantidad = cantidad - 1;
    actualizar();
  }
}

function agregarPersonalizada() {
  const sabor = opcionMarcada('sabor');
  const tamano = opcionMarcada('tamano');
  const decoracion = opcionMarcada('decoracion');
  const mensaje = limpiarTexto(document.getElementById('mensaje').value, 25);

  const quiereMensaje = document.querySelector('input[value="mensaje"]').checked;

  if (quiereMensaje === true && mensaje === '') {
    mostrarAviso('Escribe el mensaje que va sobre la galleta.', 'mal');
    document.getElementById('mensaje').focus();
    return;
  }

  const precio = calcularPrecio();
  const detalle = document.getElementById('resumen').textContent;

  agregarAlCarrito({
    clave: sabor.value + '-' + tamano.value + '-' + decoracion.value + '-' + detalle + mensaje,
    nombre: 'Galleta ' + sabor.dataset.nombre,
    detalle: detalle,
    sabor: sabor.value,
    decoracion: decoracion.value,
    tamano: tamano.value,
    mensaje: mensaje,
    precio: precio,
    cantidad: cantidad,
  });
}

function saborDeLaDireccion() {
  const direccion = window.location.search;

  if (direccion.indexOf('sabor=') !== -1) {
    const sabor = direccion.split('sabor=')[1].replace(/[^a-z-]/g, '');
    const opcion = document.querySelector('input[name="sabor"][value="' + sabor + '"]');

    if (opcion !== null) {
      opcion.checked = true;
    }
  }
}

const opciones = document.querySelectorAll('#formulario-galleta input');
for (let i = 0; i < opciones.length; i++) {
  opciones[i].addEventListener('change', actualizar);
}

document.getElementById('mensaje').addEventListener('input', actualizar);

saborDeLaDireccion();
actualizar();
