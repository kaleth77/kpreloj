console.log("Carrito KP conectado");

let carrito = JSON.parse(localStorage.getItem("kp_carrito")) || [];

/* =========================
   GUARDAR CARRITO
========================= */
function guardarCarrito() {
  localStorage.setItem("kp_carrito", JSON.stringify(carrito));
}

/* =========================
   ABRIR / CERRAR CARRITO
========================= */
function abrirCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) modal.style.display = "flex";
}

function cerrarCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) modal.style.display = "none";
}

/* =========================
   AGREGAR PRODUCTO
========================= */
function agregarAlCarrito(nombre, precio, imagen) {
  carrito.push({
    nombre,
    precio: Number(precio),
    imagen
  });

  guardarCarrito();
  actualizarCarrito();
}

/* =========================
   ELIMINAR PRODUCTO
========================= */
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarCarrito();
}

/* =========================
   ACTUALIZAR CARRITO
========================= */
function actualizarCarrito() {
  const lista = document.getElementById("lista-carrito");
  const totalElemento = document.getElementById("total");
  const contador = document.getElementById("contador-carrito");

  let total = 0;

  if (lista) {
    lista.innerHTML = "";

    carrito.forEach((producto, index) => {

      total += producto.precio;

      lista.innerHTML += `
        <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #444;">
          <img src="${producto.imagen}" width="60" style="border-radius:6px;"><br><br>

          <strong>${producto.nombre}</strong><br>

          💰 $${producto.precio.toLocaleString('es-CO')}<br><br>

          <button onclick="eliminarDelCarrito(${index})">
            ❌ Eliminar
          </button>
        </div>
      `;
    });

    if (totalElemento) {
      totalElemento.textContent = total.toLocaleString('es-CO');
    }
  }

  if (contador) {
    contador.textContent = carrito.length;
  }
}

/* =========================
   COMPRAR POR WHATSAPP
========================= */
function comprarWhatsApp() {

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  /* =========================
     MENSAJE KP (SEGURO UTF-8)
  ========================= */

 let total = 0;

let mensaje = [];

mensaje.push("🛍️ NUEVO PEDIDO - KP RELOJES ⌚");
mensaje.push("");
mensaje.push("📦 Productos seleccionados:");

carrito.forEach(producto => {

  total += producto.precio;

  mensaje.push(
    "",
    "⌚ " + producto.nombre,
    "💰 Precio: $" + producto.precio.toLocaleString('es-CO'),
    "📸 Imagen: " + producto.imagen
  );
});

mensaje.push("");
mensaje.push("━━━━━━━━━━━━━━");
mensaje.push("💵 TOTAL DEL PEDIDO: $" + total.toLocaleString('es-CO')");
mensaje.push("");
mensaje.push("📍 Datos de entrega:");
mensaje.push("✍️ Nombre:");
mensaje.push("📞 Teléfono:");
mensaje.push("🏠 Dirección:");
mensaje.push("");
mensaje.push("🚚 Envío a domicilio.");
mensaje.push("");
mensaje.push("✨ Gracias por elegir KP RELOJES");
mensaje.push("🕰️ Calidad y elegancia en cada detalle.");

mensaje = mensaje.join("\n");

  /* =========================
     GUARDAR PARA ADMIN
  ========================= */
  localStorage.setItem("kp_ultimo_total", total);
  localStorage.setItem("kp_ultima_compra", new Date().toISOString());

  /* =========================
     WHATSAPP
  ========================= */
  const url =
    "https://wa.me/573008734383?text=" +
    encodeURIComponent(mensaje);

  window.open(url, "_blank");

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

/* =========================
   INICIAR
========================= */
document.addEventListener("DOMContentLoaded", actualizarCarrito);
