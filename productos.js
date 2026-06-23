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

  return `
    <div class="card">
      ${badgeOferta}
      <img src="${imgUrl}" onclick="abrirImagen(this)" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      ${bloqueDescripcion}
      ${bloquePrecio}
      <div class="acciones-card">
        <a href="#" class="precio"
          onclick="agregarAlCarrito('${producto.nombre.replace(/'/g, "\\'")}', ${precioCobrar}, '${imgUrl}'); return false;">
          🛒
        </a>
        <a href="#" class="btn-consultar"
          onclick="consultar('${producto.nombre.replace(/'/g, "\\'")}', '${precioTextoWA}'); return false;">
          Consultar
        </a>
      </div>
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
        p.categoria && p.categoria.trim().toLowerCase() === categoria.toLowerCase()
        && p.nombre && p.imagen
      );

      if (filtrados.length === 0) {
        contenedor.innerHTML = "<p style='color:#d4af37; padding:20px;'>No hay productos en esta categoría aún.</p>";
        return;
      }

      contenedor.innerHTML = filtrados.map(crearCard).join("");
    })
    .catch(err => {
      console.error("Error cargando productos:", err);
      contenedor.innerHTML = "<p style='color:red; padding:20px;'>Error cargando productos. Revisa la consola.</p>";
    });
}
