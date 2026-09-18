const COLORES = {
  'chispas-chocolate': { masa: '#e0a75f', chispa: '#4a2f1d' },
  'doble-chocolate': { masa: '#6f4530', chispa: '#2c1810' },
  'red-velvet': { masa: '#b8433f', chispa: '#f6e7dc' },
  'vainilla-confeti': { masa: '#f2dcae', chispa: '#c0395b' },
  'avena-canela': { masa: '#cf9f6b', chispa: '#6b4a2e' },
  limon: { masa: '#ecd884', chispa: '#fff8d8' },
  'mantequilla-mani': { masa: '#d8a25c', chispa: '#8a5a2b' },
  'brownie-nuez': { masa: '#5d3a2a', chispa: '#c69a6b' },
};

const TAMANOS = {
  mini: 0.8,
  clasica: 0.95,
  gigante: 1.1,
};

const NEGRO = '#2e1d16';
const COLORES_CONFETI = ['#c0395b', '#2f7d6b', '#4a2b5f', '#e0a75f', '#3c7bb5'];

const FORMA_GALLETA =
  'M 176 117 Q 172 135 162 149 Q 151 164 134 171 Q 118 177 100 178 Q 82 178 66 170 ' +
  'Q 50 163 40 148 Q 30 134 25 117 Q 20 100 24 83 Q 28 65 38 51 Q 49 36 66 31 ' +
  'Q 83 25 100 24 Q 117 23 133 32 Q 148 40 161 52 Q 173 65 176 82 Q 179 100 176 117 Z';

const FORMA_GLASEADO =
  'M 24 100 A 76 76 0 0 1 176 100 Q 157 116 138 100 Q 119 84 100 100 ' +
  'Q 81 116 62 100 Q 43 84 24 100 Z';

const FORMA_CORAZON =
  'M 100 128 C 62 100 80 70 100 88 C 120 70 138 100 100 128 Z';

const CHISPAS = [
  [86, 55, 3.7], [139, 134, 4.1], [105, 71, 3.9], [60, 75, 5.1],
  [114, 122, 4.8], [58, 97, 3.7], [136, 74, 5.8], [109, 150, 5.6],
  [101, 89, 5.0], [91, 56, 4.3], [71, 105, 4.7], [60, 130, 4.0],
];

const GRAGEAS = [
  [95, 84, 25], [100, 152, 15], [107, 115, 7], [84, 126, 81],
  [129, 55, 43], [49, 101, 166], [112, 136, 69], [73, 123, 131],
  [90, 46, 48], [62, 72, 146], [134, 99, 4], [90, 153, 20],
  [113, 51, 104], [46, 118, 166],
];

const ESTRELLAS = [
  [72, 78, 13], [128, 92, 10], [95, 130, 12], [130, 138, 9],
];

function dibujarGalleta(sabor, decoracion, tamano, mensaje) {
  const color = COLORES[sabor] || COLORES['chispas-chocolate'];
  const escala = TAMANOS[tamano] || TAMANOS.clasica;
  const texto = mensaje || '';

  let dibujo = '';

  dibujo += '<path d="' + FORMA_GALLETA + '" fill="' + color.masa + '" stroke="' + NEGRO + '" stroke-width="3.5" />';

  for (let i = 0; i < CHISPAS.length; i++) {
    const chispa = CHISPAS[i];
    let relleno = color.chispa;

    if (sabor === 'vainilla-confeti') {
      relleno = COLORES_CONFETI[i % COLORES_CONFETI.length];
    }

    dibujo +=
      '<ellipse cx="' + chispa[0] + '" cy="' + chispa[1] + '" rx="' + chispa[2] +
      '" ry="' + (chispa[2] * 0.8) + '" fill="' + relleno + '" />';
  }

  if (decoracion === 'glaseado') {
    dibujo += '<path d="' + FORMA_GLASEADO + '" fill="#fff6ea" stroke="' + NEGRO + '" stroke-width="2.5" />';
  }

  if (decoracion === 'grageas') {
    for (let i = 0; i < GRAGEAS.length; i++) {
      const gragea = GRAGEAS[i];
      dibujo +=
        '<rect x="' + (gragea[0] - 5) + '" y="' + (gragea[1] - 2) + '" width="10" height="4" rx="2"' +
        ' fill="' + COLORES_CONFETI[i % COLORES_CONFETI.length] + '" stroke="' + NEGRO + '" stroke-width="0.8"' +
        ' transform="rotate(' + gragea[2] + ' ' + gragea[0] + ' ' + gragea[1] + ')" />';
    }
  }

  if (decoracion === 'corazon') {
    dibujo += '<path d="' + FORMA_CORAZON + '" fill="#c0395b" stroke="' + NEGRO + '" stroke-width="2.5" />';
  }

  if (decoracion === 'estrellas') {
    for (let i = 0; i < ESTRELLAS.length; i++) {
      dibujo += dibujarEstrella(ESTRELLAS[i][0], ESTRELLAS[i][1], ESTRELLAS[i][2]);
    }
  }

  if (texto !== '') {
    let letra = 260 / texto.length;
    if (letra > 24) {
      letra = 24;
    }

    dibujo +=
      '<text x="100" y="' + (80 + letra / 3) + '" text-anchor="middle" font-family="Georgia, serif"' +
      ' font-size="' + letra + '" font-weight="bold" fill="#fff6ea" stroke="' + NEGRO + '"' +
      ' stroke-width="' + (letra / 10) + '" paint-order="stroke">' + escapar(texto) + '</text>';
  }

  return (
    '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
    '<g transform="translate(100 100) scale(' + escala + ') translate(-100 -100)">' +
    dibujo +
    '</g></svg>'
  );
}

function dibujarEstrella(x, y, tamano) {
  const t = tamano;
  const forma =
    'M ' + x + ' ' + (y - t) +
    ' Q ' + x + ' ' + y + ' ' + (x + t) + ' ' + y +
    ' Q ' + x + ' ' + y + ' ' + x + ' ' + (y + t) +
    ' Q ' + x + ' ' + y + ' ' + (x - t) + ' ' + y +
    ' Q ' + x + ' ' + y + ' ' + x + ' ' + (y - t) + ' Z';

  return '<path d="' + forma + '" fill="#f6e9b0" stroke="' + NEGRO + '" stroke-width="1.6" />';
}

function crearTarjeta(galleta) {
  let etiquetas = '';
  for (let i = 0; i < galleta.etiquetas.length; i++) {
    etiquetas += '<span class="etiqueta">' + galleta.etiquetas[i] + '</span> ';
  }

  let sello = '';
  if (galleta.favorita === true) {
    sello = '<span class="favorita">Favorita</span>';
  }

  return (
    '<article class="tarjeta">' +
    sello +
    '<div class="tarjeta-dibujo">' +
    dibujarGalleta(galleta.sabor, galleta.decoracion, 'clasica', '') +
    '</div>' +
    '<div class="tarjeta-texto">' +
    '<h3>' + galleta.nombre + '</h3>' +
    '<p>' + galleta.descripcion + '</p>' +
    '<div>' + etiquetas + '</div>' +
    '<div class="tarjeta-precio">' +
    '<span class="precio">' + formatearPrecio(galleta.precio) + '</span>' +
    '<span class="texto-suave texto-chico">unidad</span>' +
    '</div>' +
    '<div class="tarjeta-botones">' +
    '<button class="boton boton-naranja" onclick="agregarGalleta(\'' + galleta.id + '\')">Agregar</button>' +
    '<a class="boton" href="personalizacion.html?sabor=' + galleta.sabor + '">Personalizar</a>' +
    '</div>' +
    '</div>' +
    '</article>'
  );
}

function agregarGalleta(id) {
  for (let i = 0; i < GALLETAS.length; i++) {
    if (GALLETAS[i].id === id) {
      const galleta = GALLETAS[i];

      agregarAlCarrito({
        clave: galleta.id,
        nombre: galleta.nombre,
        detalle: 'Tamaño clásico, tal como está en el catálogo',
        sabor: galleta.sabor,
        decoracion: galleta.decoracion,
        tamano: 'clasica',
        mensaje: '',
        extras: [],
        precio: galleta.precio,
        cantidad: 1,
      });
    }
  }
}
