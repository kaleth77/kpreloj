console.log("Carrito conectado");

let carrito = JSON.parse(localStorage.getItem("kp_carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("kp_carrito", JSON.stringify(carrito));
}

function abrirCarrito(){
  const modal = document.getElementById("modal-carrito");
  modal.style.display = "flex";
}

function cerrarCarrito(){
  const modal = document.getElementById("modal-carrito");
  modal.style.display = "none";
}

function agregarAlCarrito(nombre, precio, imagen) {
  carrito.push({ nombre, precio, imagen });
  guardarCarrito();
  actualizarCarrito();
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalElemento = document.getElementById("total");
  const contador = document.getElementById("contador-carrito");

  if (!lista) return;

  lista.innerHTML = "";
  let total = 0;

  carrito.forEach((producto, index) => {
    total += producto.precio;

    lista.innerHTML += `
      <div style="margin-bottom:10px; border-bottom:1px solid gray; padding-bottom:5px;">
        <img src="${producto.imagen}" width="50"><br>
        ${producto.nombre}<br>
        $${producto.precio.toLocaleString('es-CO')}<br>
        <button onclick="eliminarDelCarrito(${index})">❌</button>
      </div>
    `;
  });

  totalElemento.textContent = total.toLocaleString('es-CO');
  contador.textContent = carrito.length;
}

function comprarWhatsApp() {

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje =
  "\uD83D\uDED2 *NUEVO PEDIDO KP* \uD83D\uDED2" +   // 🛒
  "\n\n\uD83D\uDCE6 *PRODUCTOS:*";               // 📦

  let total = 0;

  carrito.forEach(producto => {

    mensaje +=

    "\n\n\u231A *" + producto.nombre + "*" +     // ⌚
    "\n\uD83D\uDCB0 Precio: $" + producto.precio.toLocaleString('es-CO') +  // 💰
    "\n\uD83D\uDDBC\uFE0F Imagen: " + producto.imagen; // 🖼️

    total += producto.precio;

  });

  mensaje +=

  "\n\n\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500" + // línea ─────

  "\n\uD83D\uDCB5 *TOTAL:* $" + total.toLocaleString('es-CO') +   // 💵

  "\n\n\uD83D\uDCCD *DATOS DE ENTREGA*" + // 📍
  "\n\uD83D\uDC64 Nombre:" +             // 👤
  "\n\uD83D\uDCDE Teléfono:" +           // 📞
  "\n\uD83C\uDFE0 Dirección:" +          // 🏠
  "\n\uD83D\uDCCD Referencia:" +         // 📌

  "\n\n\u2728 Gracias por comprar en *KP Relojes* \u231A"; // ✨⌚

  localStorage.setItem("kp_ultimo_total", total);

  const url =
  "https://wa.me/573008734383?text=" +
  encodeURIComponent(mensaje);

  window.open(url, "_blank");

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}
