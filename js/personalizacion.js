let cantidad = 1;
let maximo = 24;

// Si venimos del carrito aqui queda la galleta que estamos separando.
// Si es null, estamos armando una galleta nueva desde cero.
let edicion = null;

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

function extrasMarcados() {
  const extras = document.querySelectorAll('input[name="extra"]:checked');
  const lista = [];

  for (let i = 0; i < extras.length; i++) {
    lista.push(extras[i].value);
  }

  return lista;
}

function actualizar() {
  const sabor = opcionMarcada('sabor');
  const tamano = opcionMarcada('tamano');
  const decoracion = opcionMarcada('decoracion');

  const extras = document.querySelectorAll('input[name="extra"]:checked');
  let nombresExtras = '';

  for (let i = 0; i < extras.length; i++) {
    nombresExtras = nombresExtras + ' · ' + extras[i].dataset.nombre;
  }

  const precio = calcularPrecio();

  document.getElementById('vista-previa').innerHTML =
    dibujarGalleta(sabor.value, decoracion.value, tamano.value);

  document.getElementById('resumen').textContent =
    sabor.dataset.nombre + ' · ' + tamano.dataset.nombre + ' · ' + decoracion.dataset.nombre + nombresExtras;

  document.getElementById('precio-unidad').textContent = formatearPrecio(precio);
  document.getElementById('precio-total').textContent = formatearPrecio(precio * cantidad);
  document.getElementById('cantidad').textContent = cantidad;

  mostrarCartelEdicion();
}

// El cartel morado que explica cuantas galletas se estan separando del carrito.
function mostrarCartelEdicion() {
  const caja = document.getElementById('aviso-edicion');
  const titulo = document.getElementById('titulo-cantidad');
  const boton = document.getElementById('boton-agregar');

  if (edicion === null) {
    caja.classList.add('oculto');
    titulo.textContent = '5. Cantidad';
    boton.textContent = 'Agregar al carrito';
    return;
  }

  const quedan = edicion.maximo - cantidad;
  let resto = 'Es la única que tienes de esa galleta.';

  if (quedan === 1) {
    resto = 'La otra se queda tal como estaba.';
  } else if (quedan > 1) {
    resto = 'Las otras ' + quedan + ' se quedan tal como estaban.';
  }

  document.getElementById('texto-edicion').innerHTML =
    'Estás personalizando <b>' + cantidad + ' de ' + edicion.maximo + '</b> · ' +
    escapar(edicion.nombre) + '. ' + resto;

  titulo.textContent = '5. ¿Cuántas quieres personalizar? (tienes ' + edicion.maximo + ')';
  boton.textContent = 'Guardar y volver al carrito';
  caja.classList.remove('oculto');
}

function subirCantidad() {
  if (cantidad < maximo) {
    cantidad = cantidad + 1;
    actualizar();
  } else if (edicion !== null) {
    mostrarAviso('En el carrito solo tienes ' + maximo + ' de esa galleta.', 'mal');
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

  const precio = calcularPrecio();
  const detalle = document.getElementById('resumen').textContent;

  const galletaNueva = {
    clave: sabor.value + '-' + tamano.value + '-' + decoracion.value + '-' + detalle,
    nombre: 'Galleta ' + sabor.dataset.nombre,
    detalle: detalle,
    sabor: sabor.value,
    decoracion: decoracion.value,
    tamano: tamano.value,
    extras: extrasMarcados(),
    precio: precio,
    cantidad: cantidad,
  };

  if (edicion === null) {
    agregarAlCarrito(galletaNueva);
    return;
  }

  const separadas = separarYPersonalizar(edicion.clave, cantidad, galletaNueva);

  if (separadas === 0) {
    borrarPersonalizacionPendiente();
    mostrarAviso('Esa galleta ya no está en el carrito.', 'mal');
    return;
  }

  borrarPersonalizacionPendiente();
  window.location.href = 'carrito.html?personalizadas=' + separadas;
}

function cancelarEdicion() {
  borrarPersonalizacionPendiente();
  window.location.href = 'carrito.html';
}

function marcarOpcion(grupo, valor) {
  const limpio = String(valor).replace(/[^a-z-]/g, '');
  const opcion = document.querySelector('input[name="' + grupo + '"][value="' + limpio + '"]');

  if (opcion !== null) {
    opcion.checked = true;
  }
}

function marcarExtras(extras) {
  const casillas = document.querySelectorAll('input[name="extra"]');
  let lista = extras;

  if (Array.isArray(lista) === false) {
    lista = [];
  }

  for (let i = 0; i < casillas.length; i++) {
    casillas[i].checked = lista.indexOf(casillas[i].value) !== -1;
  }
}

// Si llegamos con ?editar=1 dejamos el formulario igualito a la galleta
// que el usuario escogio en el carrito, listo para cambiarle lo que quiera.
function prepararEdicion() {
  if (window.location.search.indexOf('editar=1') === -1) {
    return;
  }

  const pendiente = leerPersonalizacionPendiente();

  if (pendiente === null) {
    return;
  }

  // La linea pudo cambiar mientras tanto (otra pestana, o se vacio el carrito).
  const enCarrito = buscarEnCarrito(pendiente.clave);

  if (enCarrito === null) {
    borrarPersonalizacionPendiente();
    mostrarAviso('Esa galleta ya no está en el carrito, pero puedes armar una nueva.', 'mal');
    return;
  }

  edicion = pendiente;
  edicion.maximo = enCarrito.cantidad;
  maximo = enCarrito.cantidad;
  cantidad = 1;

  marcarOpcion('sabor', pendiente.sabor);
  marcarOpcion('tamano', pendiente.tamano);
  marcarOpcion('decoracion', pendiente.decoracion);
  marcarExtras(pendiente.extras);
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

prepararEdicion();
saborDeLaDireccion();
actualizar();
