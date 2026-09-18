const CLAVE_CARRITO = 'magic-cookies-carrito';
const CLAVE_PEDIDOS = 'magic-cookies-pedidos';
const CLAVE_PERSONALIZANDO = 'magic-cookies-personalizando';

const GALLETAS_PARA_DESCUENTO = 12;
const PORCENTAJE_DESCUENTO = 0.1;

function formatearPrecio(numero) {
  return '$ ' + Number(numero).toLocaleString('es-CO');
}

function limpiarTexto(texto, maximo) {
  let limpio = String(texto);
  limpio = limpio.replace(/<[^>]*>/g, '');
  limpio = limpio.replace(/\s+/g, ' ').trim();
  return limpio.substring(0, maximo);
}

function escapar(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function leerCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO);

    if (guardado === null) {
      return [];
    }

    return JSON.parse(guardado);
  } catch (error) {
    return [];
  }
}

function guardarCarrito(carrito) {
  try {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  } catch (error) {
    mostrarAviso('Tu navegador no deja guardar el carrito.', 'mal');
  }

  actualizarContador();
}

function agregarAlCarrito(galleta) {
  const carrito = leerCarrito();
  let repetida = false;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].clave === galleta.clave) {
      carrito[i].cantidad = carrito[i].cantidad + galleta.cantidad;
      repetida = true;
    }
  }

  if (repetida === false) {
    carrito.push(galleta);
  }

  guardarCarrito(carrito);
  mostrarAviso(galleta.nombre + ' se agregó al carrito.', 'bien');
}

function cambiarCantidad(posicion, cambio) {
  const carrito = leerCarrito();
  carrito[posicion].cantidad = carrito[posicion].cantidad + cambio;

  if (carrito[posicion].cantidad < 1) {
    carrito.splice(posicion, 1);
  }

  guardarCarrito(carrito);
}

function quitarDelCarrito(posicion) {
  const carrito = leerCarrito();
  carrito.splice(posicion, 1);
  guardarCarrito(carrito);
}

function vaciarCarrito() {
  localStorage.removeItem(CLAVE_CARRITO);
  borrarPersonalizacionPendiente();
  actualizarContador();
}

function buscarEnCarrito(clave) {
  const carrito = leerCarrito();

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].clave === clave) {
      return carrito[i];
    }
  }

  return null;
}

// Guarda cual galleta del carrito se va a personalizar, para que la pagina
// de personalizacion sepa de donde viene el usuario.
function guardarPersonalizacionPendiente(dato) {
  try {
    localStorage.setItem(CLAVE_PERSONALIZANDO, JSON.stringify(dato));
    return true;
  } catch (error) {
    mostrarAviso('Tu navegador no deja guardar la personalizacion.', 'mal');
    return false;
  }
}

function leerPersonalizacionPendiente() {
  try {
    const guardado = localStorage.getItem(CLAVE_PERSONALIZANDO);

    if (guardado === null) {
      return null;
    }

    return JSON.parse(guardado);
  } catch (error) {
    return null;
  }
}

function borrarPersonalizacionPendiente() {
  localStorage.removeItem(CLAVE_PERSONALIZANDO);
}

// Saca `cuantas` unidades de la linea `clave` y mete la galleta personalizada
// en su lugar. Las unidades que no se personalizan se quedan como estaban.
// Devuelve cuantas alcanzo a separar de verdad.
function separarYPersonalizar(clave, cuantas, galletaNueva) {
  const carrito = leerCarrito();
  let separadas = 0;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].clave === clave) {
      separadas = Math.min(cuantas, carrito[i].cantidad);
      carrito[i].cantidad = carrito[i].cantidad - separadas;

      if (carrito[i].cantidad < 1) {
        carrito.splice(i, 1);
      }

      break;
    }
  }

  let repetida = false;

  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].clave === galletaNueva.clave) {
      carrito[i].cantidad = carrito[i].cantidad + galletaNueva.cantidad;
      repetida = true;
      break;
    }
  }

  if (repetida === false) {
    carrito.push(galletaNueva);
  }

  guardarCarrito(carrito);
  return separadas;
}

function contarGalletas() {
  const carrito = leerCarrito();
  let total = 0;

  for (let i = 0; i < carrito.length; i++) {
    total = total + carrito[i].cantidad;
  }

  return total;
}

function calcularTotales() {
  const carrito = leerCarrito();
  let subtotal = 0;

  for (let i = 0; i < carrito.length; i++) {
    subtotal = subtotal + carrito[i].precio * carrito[i].cantidad;
  }

  const cantidad = contarGalletas();
  let descuento = 0;

  if (cantidad >= GALLETAS_PARA_DESCUENTO) {
    descuento = Math.round(subtotal * PORCENTAJE_DESCUENTO);
  }

  return {
    cantidad: cantidad,
    subtotal: subtotal,
    descuento: descuento,
    total: subtotal - descuento,
  };
}

function actualizarContador() {
  const contador = document.getElementById('contador-carrito');
  if (contador !== null) {
    contador.textContent = contarGalletas();
  }
}

function abrirMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('cerrado');
}

function mostrarAviso(texto, tipo) {
  let caja = document.getElementById('avisos');

  if (caja === null) {
    caja = document.createElement('div');
    caja.id = 'avisos';
    document.body.appendChild(caja);
  }

  const aviso = document.createElement('div');
  aviso.className = 'aviso-flotante ' + tipo;
  aviso.textContent = texto;
  caja.appendChild(aviso);

  setTimeout(function () {
    aviso.remove();
  }, 3000);
}

actualizarContador();
