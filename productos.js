const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS02ENtcg8PoDQ8rIsUqjDJqXxwbDjsDEOqbSdMAGUIY4U_6ruB1N2M-UcXaWFJbEgZe-J4Yk4asPKP/pub?gid=727495021&single=true&output=csv";
const BASE_IMG = "https://kaleth77.github.io/kpreloj/img/";

function parsearCSV(texto) {
  const filas = texto.trim().split("\n");
  const encabezados = filas[0].split(",").map(e => e.trim());

  return filas.slice(1).map(fila => {
    const valores = [];
    let actual = "";
    let dentroComillas = false;

    for (let c of fila) {
      if (c === '"') {
        dentroComillas = !dentroComillas;
      } else if (c === ',' && !dentroComillas) {
        valores.push(actual.trim());
        actual = "";
      } else {
        actual += c;
      }
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

  const noDisponible =
    producto.noDisponible &&
    producto.noDisponible.trim() !== "";

  const tieneRebaja =
    producto.precioRebaja
    && producto.precioRebaja.trim() !== ""
    && !isNaN(parseInt(producto.precioRebaja))
    && parseInt(producto.precioRebaja) > 0
    && parseInt(producto.precioRebaja) < precioNum;

  const precioRebajaNum = tieneRebaja
    ? parseInt(producto.precioRebaja)
    : null;

  const precioCobrar = tieneRebaja
    ? precioRebajaNum
    : precioNum;

  const precioFormato =
    "$" + precioNum.toLocaleString('es-CO');

  const precioRebajaFormato =
    tieneRebaja
      ? "$" + precioRebajaNum.toLocaleString('es-CO')
      : "";

  const descripcion = (producto.descripcion || "").trim();

  const descId =
    "desc_" +
    (producto.nombre + producto.imagen)
      .replace(/[^a-zA-Z0-9]/g, "");

  const bloquePrecio = tieneRebaja
    ? `<div class="precio-rebaja-wrap">
         <span class="precio-original-tachado">${precioFormato}</span>
         <span class="precio-valor precio-oferta">${precioRebajaFormato}</span>
       </div>`
    : <div class="precio-valor">${precioFormato}</div>;

  const badgeOferta =
    tieneRebaja
      ? <span class="badge-oferta">OFERTA</span>
      : "";

  const badgeNoDisponible =
    noDisponible
      ? <span class="badge-no-disponible">NO DISPONIBLE</span>
      : "";

  const bloqueDescripcion = descripcion
    ? (
        descripcion.length > 60
          ? `<input type="checkbox" id="${descId}" class="desc-toggle-check">
             <div class="descripcion-wrap">
               <p class="descripcion-producto">${descripcion}</p>
               <label for="${descId}" class="desc-ver-mas">Ver más</label>
               <label for="${descId}" class="desc-ver-menos">Ver menos</label>
             </div>`
          : <p class="descripcion-producto descripcion-corta">${descripcion}</p>
      )
    : "";

  const precioTextoWA =
    tieneRebaja
      ? precioRebajaFormato
      : precioFormato;

  const nombreEscapado =
    producto.nombre.replace(/'/g, "\\'");

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


/* ==========================================
   CARGAR PRODUCTOS + BUSCADOR Y FILTROS
   ========================================== */

function cargarProductos(categoria) {

  const contenedor = document.getElementById("productos");

  contenedor.innerHTML =
    "<p style='color:#d4af37; padding:20px;'>Cargando productos...</p>";

  fetch(SHEET_URL)
    .then(res => res.text())
    .then(csv => {

      const todos = parsearCSV(csv);

      /* Productos de la categoría */
      const filtrados = todos.filter(p =>
        p.categoria &&
        p.categoria.trim().toLowerCase() === categoria.toLowerCase()
        &&
        p.nombre &&
        p.imagen
      );

      if (filtrados.length === 0) {

        contenedor.innerHTML =
          "<p style='color:#d4af37; padding:20px;'>No hay productos en esta categoría aún.</p>";

        return;
      }


      /* ==========================================
         FUNCIÓN QUE APLICA LOS FILTROS
         ========================================== */

      function aplicarFiltros() {

        const inputBuscar =
          document.getElementById("buscarProducto");

        const inputMin =
          document.getElementById("precioMin");

        const inputMax =
          document.getElementById("precioMax");


        const texto =
          inputBuscar
            ? inputBuscar.value.trim().toLowerCase()
            : "";


        const precioMin =
          inputMin && inputMin.value !== ""
            ? parseInt(inputMin.value)
            : null;


        const precioMax =
          inputMax && inputMax.value !== ""
            ? parseInt(inputMax.value)
            : null;


        const resultados = filtrados.filter(producto => {

          /* -----------------------------
             BUSCAR POR NOMBRE
             ----------------------------- */

          const nombre =
            producto.nombre
              .toLowerCase();

          const coincideNombre =
            texto === "" ||
            nombre.includes(texto);


          /* -----------------------------
             PRECIO REAL DEL PRODUCTO
             ----------------------------- */

          const precioNormal =
            parseInt(producto.precio) || 0;

          const precioRebaja =
            parseInt(producto.precioRebaja);

          const tieneRebaja =
            producto.precioRebaja
            &&
            producto.precioRebaja.trim() !== ""
            &&
            !isNaN(precioRebaja)
            &&
            precioRebaja > 0
            &&
            precioRebaja < precioNormal;


          const precioFinal =
            tieneRebaja
              ? precioRebaja
              : precioNormal;


          /* -----------------------------
             FILTRO PRECIO DESDE
             ----------------------------- */

          const coincideMin =
            precioMin === null ||
            precioFinal >= precioMin;


          /* -----------------------------
             FILTRO PRECIO HASTA
             ----------------------------- */

          const coincideMax =
            precioMax === null ||
            precioFinal <= precioMax;


          return (
            coincideNombre &&
            coincideMin &&
            coincideMax
          );
        });


        /* -----------------------------
           MOSTRAR RESULTADOS
           ----------------------------- */

        if (resultados.length === 0) {

          contenedor.innerHTML = `
            <p style="
              color:#d4af37;
              padding:30px;
              text-align:center;
              width:100%;
            ">
              No encontramos productos con esos filtros.
            </p>
          `;

          return;
        }


        contenedor.innerHTML =
          resultados.map(crearCard).join("");
      }


      /* ==========================================
         ACTIVAR BUSCADOR
         ========================================== */

      const inputBuscar =
        document.getElementById("buscarProducto");

      const inputMin =
        document.getElementById("precioMin");

      const inputMax =
        document.getElementById("precioMax");

      const botonLimpiar =
        document.getElementById("limpiarFiltros");


      if (inputBuscar) {
        inputBuscar.addEventListener(
          "input",
          aplicarFiltros
        );
      }


      if (inputMin) {
        inputMin.addEventListener(
          "input",
          aplicarFiltros
        );
      }


      if (inputMax) {
        inputMax.addEventListener(
          "input",
          aplicarFiltros
        );
      }


      /* ==========================================
         BOTÓN LIMPIAR
         ========================================== */

      if (botonLimpiar) {

        botonLimpiar.addEventListener(
          "click",
          () => {

            if (inputBuscar)
              inputBuscar.value = "";

            if (inputMin)
              inputMin.value = "";

            if (inputMax)
              inputMax.value = "";

            aplicarFiltros();
          }
        );
      }


      /* Mostrar productos normalmente al entrar */
      aplicarFiltros();

    })
    .catch(err => {

      console.error(
        "Error cargando productos:",
        err
      );

      contenedor.innerHTML =
        "<p style='color:red; padding:20px;'>Error cargando productos. Revisa la consola.</p>";
    });
}
