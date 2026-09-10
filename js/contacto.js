const WHATSAPP_CONTACTO = '3133784021';
const CORREO = 'hola@magiccookies.co';

function abrirPregunta(numero) {
  const respuesta = document.getElementById('respuesta-' + numero);
  const signo = document.getElementById('signo-' + numero);

  if (respuesta.classList.contains('oculto')) {
    respuesta.classList.remove('oculto');
    signo.textContent = '-';
  } else {
    respuesta.classList.add('oculto');
    signo.textContent = '+';
  }
}

function enviarMensaje(evento) {
  evento.preventDefault();

  const errores = document.querySelectorAll('.error');
  for (let i = 0; i < errores.length; i++) {
    errores[i].textContent = '';
  }

  const nombre = limpiarTexto(document.getElementById('nombre').value, 60);
  const correo = limpiarTexto(document.getElementById('correo').value, 80);
  const mensaje = limpiarTexto(document.getElementById('mensaje').value, 400);
  let todoBien = true;

  if (nombre.length < 3) {
    document.getElementById('error-nombre').textContent = 'Escribe tu nombre.';
    todoBien = false;
  }

  if (/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(correo) === false) {
    document.getElementById('error-correo').textContent = 'Ese correo no parece válido.';
    todoBien = false;
  }

  if (mensaje.length < 10) {
    document.getElementById('error-mensaje').textContent = 'Cuéntanos un poco más (mínimo 10 letras).';
    todoBien = false;
  }

  if (todoBien === false) {
    mostrarAviso('Revisa los campos marcados.', 'mal');
    return;
  }

  const texto = 'Hola Magic Cookies, soy ' + nombre + ' (' + correo + '). ' + mensaje;
  const enlaceWhatsapp = 'https://wa.me/' + WHATSAPP_CONTACTO + '?text=' + encodeURIComponent(texto);
  const enlaceCorreo =
    'mailto:' + CORREO + '?subject=' + encodeURIComponent('Mensaje de ' + nombre) +
    '&body=' + encodeURIComponent(mensaje + '\n\nResponder a: ' + correo);

  const salida = document.getElementById('salida');

  salida.innerHTML =
    '<div class="aviso aviso-verde">' +
    '<div>' +
    '<p><b>Listo, ' + escapar(nombre) + '.</b> Tu mensaje quedó escrito.</p>' +
    '<p class="texto-chico" style="margin-top:6px">Esta página no tiene servidor, así que tú decides por dónde enviarlo:</p>' +
    '<p style="margin-top:12px">' +
    '<a class="boton boton-naranja" href="' + enlaceWhatsapp + '" target="_blank">Enviar por WhatsApp</a> ' +
    '<a class="boton" href="' + enlaceCorreo + '">Enviar por correo</a>' +
    '</p>' +
    '</div>' +
    '</div>';

  salida.classList.remove('oculto');
  document.getElementById('formulario-contacto').reset();
  mostrarAviso('Mensaje listo para enviar.', 'bien');
}

document.getElementById('formulario-contacto').addEventListener('submit', enviarMensaje);
