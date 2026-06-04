console.log("Carrito conectado");

let carrito = JSON.parse(localStorage.getItem("kp_carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("kp_carrito", JSON.stringify(carrito));
}

function abrirCarrito() {
  const modal = document.getElementById("modal-carrito");
  modal.style.display = "flex";
}

function cerrarCarrito() {
  const modal = document.getElementById("modal-carrito");
  modal.style.display = "none";
}

function agregarAlCarrito(nombre, precio, imagen) {
  carrito.push({
    nombre,
    precio: Number(precio),
    imagen
  });

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

  let total = 0;

  if (lista) {
    lista.innerHTML = "";

    carrito.forEach((producto, index) => {
      total += producto.precio;

      lista.innerHTML += `
        <div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #444;">
          <img src="${producto.imagen}" width="60" style="border-radius:6px;"><br><br>

          <strong>${producto.nombre}</strong><br>

          $${producto.precio.toLocaleString('es-CO')}<br><br>

          <button onclick="eliminarDelCarrito(${index})">
            ❌ Eliminar
          </button>
        </div>
      `;
    });

    totalElemento.textContent = total.toLocaleString('es-CO');
  }

  if (contador) {
    contador.textContent = carrito.length;
  }
}

function comprarWhatsApp() {

  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "🛒 PEDIDO KP RELOJES\n\n";
  mensaje += "📦 Productos:\n\n";

  let total = 0;

  carrito.forEach(producto => {

    total += producto.precio;

    mensaje +=
      "• " + producto.nombre +
      "\n💰 $" + producto.precio.toLocaleString('es-CO') +
      "\n🔗 " + producto.imagen +
      "\n\n";
  });

  mensaje += "━━━━━━━━━━━━━━\n";
  mensaje += "💰 TOTAL: $" + total.toLocaleString('es-CO');
  mensaje += "\n\n📍 Enviar datos de entrega.";

  // GUARDA EL TOTAL PARA EL ADMIN.HTML
  localStorage.setItem("kp_ultimo_total", total);

  // GUARDA FECHA DE COMPRA
  localStorage.setItem(
    "kp_ultima_compra",
    new Date().toISOString()
  );

  const url =
    "https://wa.me/573008734383?text=" +
    encodeURIComponent(mensaje);

  window.open(url, "_blank");

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

document.addEventListener("DOMContentLoaded", () => {
  actualizarCarrito();
});
