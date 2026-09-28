let cantidad = 1;
let maximo = 24;

// Si venimos del carrito aqui queda la galleta que estamos separando.
// Si es null, estamos armando una galleta nueva desde cero.
let edicion = null;

function opcionMarcada(nombreDelGrupo) {
  return document.querySelector('input[name="' + nombreDelGrupo + '"]:checked');
}

function buscarProducto(id) {
  for (let i = 0; i < GALLETAS.length; i++) {
    if (GALLETAS[i].id === id) {
      return GALLETAS[i];
    }
  }

  return null;
}

// Arma las opciones de topincs con lo que hay en el catalogo (datos.js),
// asi si se agrega un topinc al catalogo aparece aqui solo.
function crearOpciones() {
  let topincs = '';

  for (let i = 0; i < GALLETAS.length; i++) {
    const producto = GALLETAS[i];

    if (producto.tipo === 'topinc') {
      topincs +=
        '<label class="opcion opcion-foto">' +
        '<input type="checkbox" name="topinc" value="' + producto.id + '">' +
        '<img src="' + producto.foto + '" alt="">' +
        '<span>' + producto.nombre + '</span>' +
        '<span class="costo">+ ' + formatearPrecio(producto.precio) + '</span>' +
        '</label>';
    }
  }

  document.getElementById('opciones-topinc').innerHTML = topincs;

  document.getElementById('galleta-base').innerHTML =
    dibujarGalleta(GALLETA_BASICA.sabor, GALLETA_BASICA.decoracion, 'clasica') +
    '<div>' +
    '<b>' + GALLETA_BASICA.nombre + '</b>' +
    '<span class="texto-suave texto-chico">Recién horneada, lista para tus topincs · ' +
    formatearPrecio(GALLETA_BASICA.precio) + '</span>' +
    '</div>';
}

function marcados(nombreDelGrupo) {
  const casillas = document.querySelectorAll('input[name="' + nombreDelGrupo + '"]:checked');
  const lista = [];

  for (let i = 0; i < casillas.length; i++) {
    lista.push(casillas[i].value);
  }

  return lista;
}

function calcularPrecio() {
  const galleta = GALLETA_BASICA;
  const topincs = marcados('topinc');
  const extras = document.querySelectorAll('input[name="extra"]:checked');

  let precio = galleta.precio;

  for (let i = 0; i < topincs.length; i++) {
    precio = precio + buscarProducto(topincs[i]).precio;
  }

  for (let i = 0; i < extras.length; i++) {
    precio = precio + Number(extras[i].dataset.precio);
  }

  return precio;
}

// Texto corto con lo que se escogio, ej: "Doble Chocolate · Topincs: Fresa, Cereal · Empaque de regalo"
function textoResumen() {
  const galleta = GALLETA_BASICA;
  const topincs = marcados('topinc');
  const extras = document.querySelectorAll('input[name="extra"]:checked');

  let texto = galleta.nombre;

  if (topincs.length > 0) {
    const nombres = [];
    for (let i = 0; i < topincs.length; i++) {
      nombres.push(buscarProducto(topincs[i]).nombre);
    }
    texto = texto + ' · Topincs: ' + nombres.join(', ');
  } else {
    texto = texto + ' · Sin topincs';
  }

  for (let i = 0; i < extras.length; i++) {
    texto = texto + ' · ' + extras[i].dataset.nombre;
  }

  return texto;
}

function actualizar() {
  const galleta = GALLETA_BASICA;
  const topincs = marcados('topinc');
  const precio = calcularPrecio();

  let fotosTopincs = '';
  for (let i = 0; i < topincs.length; i++) {
    const topinc = buscarProducto(topincs[i]);
    fotosTopincs += '<img src="' + topinc.foto + '" alt="' + topinc.nombre + '" title="' + topinc.nombre + '">';
  }

  document.getElementById('vista-previa').innerHTML =
    dibujarGalleta(galleta.sabor, galleta.decoracion, 'gigante') +
    '<div class="vista-previa-topincs">' + fotosTopincs + '</div>';

  document.getElementById('resumen').textContent = textoResumen();

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
    titulo.textContent = '4. Cantidad';
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

  titulo.textContent = '4. ¿Cuántas quieres personalizar? (tienes ' + edicion.maximo + ')';
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
  const galleta = GALLETA_BASICA;
  const topincs = marcados('topinc');
  const extras = marcados('extra');

  let nombre = galleta.nombre;
  if (topincs.length > 0 || extras.length > 0) {
    nombre = 'Galleta personalizada';
  }

  const galletaNueva = {
    clave: 'p-' + galleta.id + '-' + topincs.join('-') + '-' + extras.join('-'),
    nombre: nombre,
    detalle: textoResumen(),
    galleta: galleta.id,
    sabor: galleta.sabor,
    decoracion: galleta.decoracion,
    tamano: 'clasica',
    topincs: topincs,
    extras: extras,
    precio: calcularPrecio(),
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

function marcarCasillas(grupo, valores) {
  const casillas = document.querySelectorAll('input[name="' + grupo + '"]');
  let lista = valores;

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

  marcarCasillas('topinc', pendiente.topincs);
  marcarCasillas('extra', pendiente.extras);
}

crearOpciones();

const opciones = document.querySelectorAll('#formulario-galleta input');
for (let i = 0; i < opciones.length; i++) {
  opciones[i].addEventListener('change', actualizar);
}

prepararEdicion();
actualizar();
