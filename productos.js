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
  const precioFormato = "$" + precioNum.toLocaleString('es-CO');

  return `
    <div class="card">
      <img src="${imgUrl}" onclick="abrirImagen(this)" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <div class="precio-valor">${precioFormato}</div>
      <a href="#" class="precio"
        onclick="agregarAlCarrito('${producto.nombre.replace(/'/g, "\\'")}', ${precioNum}, '${imgUrl}'); return false;">
        🛒
      </a>
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