# Magic Cookies

Tienda web de galletas para el proyecto final. Está hecha solo con
**HTML, CSS y JavaScript**: no usa frameworks, ni librerías, ni programas raros.

## Cómo abrirla

Doble clic en **`index.html`**. Listo, no hay que instalar nada.

(Si se quiere editar, cualquier editor sirve: Bloc de notas, Visual Studio Code…
Se guarda el archivo y se recarga la página con F5.)

---

## Qué hay en cada carpeta

```
Proyecto-Final/
│
├── index.html             1. Inicio
├── catalogo.html          2. Catálogo
├── personalizacion.html   (en pausa, no está enlazada todavía)
├── carrito.html           3. Carrito
├── pedido.html            4. Pedido
├── contacto.html          5. Contacto
│
├── css/
│   ├── estilos.css        Lo que se repite en todas: colores, barra, pie, botones
│   └── paginas.css        Lo propio de cada página
│
├── js/
│   ├── comun.js           El carrito y el contador (se usa en TODAS las páginas)
│   ├── datos.js           La lista de galletas con sus precios
│   ├── galletas.js        Dibuja las galletas en SVG
│   ├── inicio.js          \
│   ├── catalogo.js         |
│   ├── personalizacion.js  |  Un archivo por página
│   ├── carrito.js          |
│   ├── pedido.js           |
│   └── contacto.js        /
│
└── img/
    └── logo.svg           El logo
```

Cada página carga solo los JS que necesita, al final del `<body>`:

```html
<script src="js/comun.js"></script>
<script src="js/datos.js"></script>
<script src="js/galletas.js"></script>
<script src="js/catalogo.js"></script>
```

---

## Cosas que hay que saber para sustentarlo

**El carrito** se guarda en el `localStorage` del navegador (`comun.js`). Por eso
las galletas siguen ahí aunque se cierre la página, y por eso el carrito está
vacío si se abre en otro computador.

**Las galletas no son fotos.** `galletas.js` las dibuja con SVG: hay una forma
para el contorno, otra para el glaseado, y una lista con las posiciones de las
chispas. La función `dibujarGalleta()` cambia los colores según el sabor y le
pega encima la decoración. Por eso en el personalizador se ve el cambio al
instante.

**Los precios del personalizador están en el HTML**, en los atributos
`data-precio` y `data-factor` de cada opción. El JavaScript solo los lee y los
suma:

```
precio = (precio del sabor × factor del tamaño) + decoración + extras
```

**Desde 12 galletas** se aplica un descuento del 10% ("docena mágica"). Está en
`comun.js`, en la función `calcularTotales()`.

**Seguridad:** todo lo que escribe una persona pasa por `limpiarTexto()`, que
quita las etiquetas HTML para que nadie pueda meter código en la página. Los
formularios se revisan antes de guardar.

**La personalización está en pausa.** `personalizacion.html` y
`js/personalizacion.js` siguen en el proyecto, pero ningún enlace lleva ahí. En
el código, todo lo que se apagó está comentado con la marca
`Personalizacion en pausa`, así que para reactivarla basta con quitar esos
comentarios.

---

## Dónde cambiar lo más común

| Quiero cambiar…                   | Archivo                   |
| --------------------------------- | ------------------------- |
| Los colores de toda la web        | `css/estilos.css` (arriba, en `:root`) |
| Las galletas, precios y fotos     | `js/datos.js`             |
| Los sabores, tamaños y extras     | `personalizacion.html`    |
| Los lugares y horas de entrega    | `pedido.html`             |
| Las preguntas frecuentes          | `contacto.html`           |
| El WhatsApp y el correo           | `js/pedido.js` y `js/contacto.js` (arriba) |

---

## Los puntos del proyecto

1. **Inicio** — nombre, logo e imágenes de las galletas.
2. **Catálogo** — sabores, diseños y precios, con filtros y buscador.
3. **Carrito** — lo que se quiere comprar y el precio total.
4. **Pedido** — datos del estudiante y lugar de entrega dentro del colegio, con
   un código para reclamarlo.
5. **Contacto** — WhatsApp, correo, dónde encontrarnos y preguntas frecuentes.

*Pendiente:* **Personalización** — sabor, tamaño, decoración, extras y mensaje,
con vista previa y precio en vivo. Ya está hecha, pero por ahora queda
deshabilitada.
