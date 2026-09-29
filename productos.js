const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS02ENtcg8PoDQ8rIsUqjDJqXxwbDjsDEOqbSdMAGUIY4U_6ruB1N2M-UcXaWFJbEgZe-J4Yk4asPKP/pub?gid=727495021&single=true&output=csv";
const BASE_IMG = "https://kaleth77.github.io/kpreloj/img/";

function parsearCSV(texto) {
  const filas = texto.trim().split("\n");
  const encabezados = filas[0].split(",").map(e => e.trim());
  return filas.slice(1).map(fila => {
    // Manejo de comas dentro de comillas
    const valores = [];
    let actual = "";
    let dentroComillas = false;
    for (let c of fila) {
      if (c === '"') { dentroComillas = !dentroComillas; }
      else if (c === ',' && !dentroComillas) { valores.push(actual.trim()); actual = ""; }
      else { actual += c; }
    }
    valores.push(actual.trim());
    const obj = {};
    encabezados.forEach((enc, i) => obj[enc] = valores[i] || "");
    return obj;
  });
}

function crearCard(producto) {
  const imgUrl = BASE_IMG + producto.imagen;
  const precioNum = parseInt(producto.precio);

  // noDisponible es opcional: si tiene cualquier valor no vacío (x, ., 1, etc.) se considera marcado
  const noDisponible = producto.noDisponible && producto.noDisponible.trim() !== "";

  // precioRebaja es opcional: si viene vacío, null o no es un número válido, no hay oferta
  const tieneRebaja = producto.precioRebaja
    && producto.precioRebaja.trim() !== ""
    && !isNaN(parseInt(producto.precioRebaja))
    && parseInt(producto.precioRebaja) > 0
    && parseInt(producto.precioRebaja) < precioNum;

  const precioRebajaNum = tieneRebaja ? parseInt(producto.precioRebaja) : null;
  const precioCobrar = tieneRebaja ? precioRebajaNum : precioNum;

  const precioFormato = "$" + precioNum.toLocaleString('es-CO');
  const precioRebajaFormato = tieneRebaja ? "$" + precioRebajaNum.toLocaleString('es-CO') : "";

  const descripcion = (producto.descripcion || "").trim();
  // ID único para el checkbox de "ver más" (basado en nombre+imagen para evitar colisiones)
  const descId = "desc_" + (producto.nombre + producto.imagen).replace(/[^a-zA-Z0-9]/g, "");

  const bloquePrecio = tieneRebaja
    ? `<div class="precio-rebaja-wrap">
         <span class="precio-original-tachado">${precioFormato}</span>
         <span class="precio-valor precio-oferta">${precioRebajaFormato}</span>
       </div>`
    : `<div class="precio-valor">${precioFormato}</div>`;

  const badgeOferta = tieneRebaja ? `<span class="badge-oferta">OFERTA</span>` : "";
  const badgeNoDisponible = noDisponible ? `<span class="badge-no-disponible">NO DISPONIBLE</span>` : "";

  const bloqueDescripcion = descripcion
    ? (descripcion.length > 60
        ? `<input type="checkbox" id="${descId}" class="desc-toggle-check">
           <div class="descripcion-wrap">
             <p class="descripcion-producto">${descripcion}</p>
             <label for="${descId}" class="desc-ver-mas">Ver más</label>
             <label for="${descId}" class="desc-ver-menos">Ver menos</label>
           </div>`
        : `<p class="descripcion-producto descripcion-corta">${descripcion}</p>`)
    : "";

  const precioTextoWA = tieneRebaja ? precioRebajaFormato : precioFormato;
  const nombreEscapado = producto.nombre.replace(/'/g, "\\'");

  // Si está marcado como no disponible, no se muestran los botones de carrito/consultar/comprar
  const bloqueAcciones = noDisponible
    ? `<div class="acciones-card">
        <span class="texto-no-disponible">No disponible</span>
      </div>`
    : `<div class="acciones-card">
        <a href="#" class="precio"
          onclick="agregarAlCarrito('${nombreEscapado}', ${precioCobrar}, '${imgUrl}'); return false;">
          🛒 Agregar al carrito
        </a>
        <a href="#" class="btn-consultar"
          onclick="consultar('${nombreEscapado}', '${precioTextoWA}', '${imgUrl}'); return false;">
          💬 Preguntar por producto
        </a>
        <a href="#" class="btn-comprar"
          onclick="agregarAlCarrito('${nombreEscapado}', ${precioCobrar}, '${imgUrl}'); comprarWhatsApp(); return false;">
          🛍️ Comprar ya
        </a>
      </div>`;

  return `
    <div class="card${noDisponible ? ' card-no-disponible' : ''}">
      ${badgeOferta}
      ${badgeNoDisponible}
      <img src="${imgUrl}" onclick="abrirImagen(this)" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      ${bloqueDescripcion}
      ${bloquePrecio}
      ${bloqueAcciones}
    </div>
  `;
}

function cargarProductos(categoria) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "<p style='color:#d4af37; padding:20px;'>Cargando productos...</p>";

  fetch(SHEET_URL)
    .then(res => res.text())
    .then(csv => {
      const todos = parsearCSV(csv);

      const filtrados = todos.filter(p =>
        p.categoria &&
        p.categoria.trim().toLowerCase() === categoria.toLowerCase() &&
        p.nombre &&
        p.imagen
      );

      if (filtrados.length === 0) {
        contenedor.innerHTML = "<p style='color:#d4af37; padding:20px;'>No hay productos en esta categoría aún.</p>";
        return;
      }

      // Guardamos los productos originales de esta categoría
      window.productosCategoria = filtrados;

      // Mostramos los productos normalmente
      mostrarProductos(filtrados);
    })
    .catch(err => {
      console.error("Error cargando productos:", err);
      contenedor.innerHTML = "<p style='color:red; padding:20px;'>Error cargando productos. Revisa la consola.</p>";
    });
}


function mostrarProductos(productos) {
  const contenedor = document.getElementById("productos");

  if (productos.length === 0) {
    contenedor.innerHTML = "<p style='color:#d4af37; padding:20px;'>No se encontraron productos.</p>";
    return;
  }

  contenedor.innerHTML = productos.map(crearCard).join("");
}


// Aplicar buscador y filtros de precio
function aplicarFiltros() {
  const productos = window.productosCategoria || [];

  const texto = document.getElementById("buscarProducto")?.value
    .trim()
    .toLowerCase() || "";

  const precioMinTexto = document.getElementById("precioMin")?.value;
  const precioMaxTexto = document.getElementById("precioMax")?.value;

  const precioMin = precioMinTexto !== ""
    ? parseInt(precioMinTexto)
    : null;

  const precioMax = precioMaxTexto !== ""
    ? parseInt(precioMaxTexto)
    : null;

  const filtrados = productos.filter(producto => {

    // Buscar en cualquier parte del nombre
    const nombre = (producto.nombre || "").toLowerCase();

    const coincideNombre = nombre.includes(texto);

    // Usar precio de rebaja si existe; si no, precio normal
    const tieneRebaja =
      producto.precioRebaja &&
      producto.precioRebaja.trim() !== "" &&
      !isNaN(parseInt(producto.precioRebaja)) &&
      parseInt(producto.precioRebaja) > 0 &&
      parseInt(producto.precioRebaja) < parseInt(producto.precio);

    const precio = tieneRebaja
      ? parseInt(producto.precioRebaja)
      : parseInt(producto.precio);

    const coincideMin =
      precioMin === null || precio >= precioMin;

    const coincideMax =
      precioMax === null || precio <= precioMax;

    return coincideNombre && coincideMin && coincideMax;
  });

  mostrarProductos(filtrados);
}


// Activar los filtros cuando se escriba o cambie un precio
document.addEventListener("DOMContentLoaded", function () {

  const buscar = document.getElementById("buscarProducto");
  const precioMin = document.getElementById("precioMin");
  const precioMax = document.getElementById("precioMax");
  const limpiar = document.getElementById("limpiarFiltros");

  if (buscar) {
    buscar.addEventListener("input", aplicarFiltros);
  }

  if (precioMin) {
    precioMin.addEventListener("input", aplicarFiltros);
  }

  if (precioMax) {
    precioMax.addEventListener("input", aplicarFiltros);
  }

  if (limpiar) {
    limpiar.addEventListener("click", function () {
      buscar.value = "";
      precioMin.value = "";
      precioMax.value = "";

      aplicarFiltros();
    });
  }
});
