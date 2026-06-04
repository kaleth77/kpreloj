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

let mensaje =
"\u{1F6D2} NUEVO PEDIDO - KP RELOJES \u231A" +
"\n\n\u{1F4E6} Productos seleccionados:\n";

carrito.forEach(producto => {

  total += producto.precio;

  mensaje +=
    "\n\u2022 \u231A " + producto.nombre +
    "\n\u{1F4B0} Precio: $" + producto.precio.toLocaleString('es-CO') +
    "\n\u{1F4F8} Imagen: " + producto.imagen +
    "\n";
});

mensaje +=
"\n━━━━━━━━━━━━━━" +
"\n\u{1F4B5} TOTAL DEL PEDIDO: $" + total.toLocaleString('es-CO') +
"\n\n\u{1F4CD} Datos de entrega:" +
"\n\u270D Nombre:" +
"\n\u{1F4DE} Teléfono:" +
"\n\u{1F3E0} Dirección:" +
"\n\n\u{1F69A} Envío a domicilio." +
"\n\n\u2728 Gracias por elegir KP RELOJES" +
"\n\u{1F570} Calidad y elegancia en cada detalle.";

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
