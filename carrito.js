console.log("Carrito KP conectado");

let carrito = JSON.parse(localStorage.getItem("kp_carrito")) || [];

/* =========================
   GUARDAR CARRITO
========================= */
function guardarCarrito() {
  localStorage.setItem("kp_carrito", JSON.stringify(carrito));
}

/* =========================
   ABRIR / CERRAR
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
   WHATSAPP
========================= */
function comprarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito est\u00E1 vac\u00EDo");
    return;
  }

  var bolsa   = "\uD83D\uDED2"; // 🛒
  var reloj1  = "\u231A";       // ⌚
  var reloj2  = "\uD83D\uDD70"; // 🕰️
  var paquete = "\uD83D\uDCE6"; // 📦
  var dinero  = "\uD83D\uDCB0"; // 💰
  var billete = "\uD83D\uDCB5"; // 💵
  var camara  = "\uD83D\uDCF8"; // 📸
  var pin     = "\uD83D\uDCCD"; // 📍
  var lapiz   = "\u270D";       // ✍️
  var tel     = "\uD83D\uDCDE"; // 📞
  var casa    = "\uD83C\uDFE0"; // 🏠
  var camion  = "\uD83D\uDE9A"; // 🚚
  var brillo  = "\u2728";       // ✨
  var separador = "\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501";

  let mensaje = bolsa + " NUEVO PEDIDO - KP RELOJES " + reloj1 + "\n\n"
              + paquete + " Productos seleccionados:\n";

  let total = 0;
  carrito.forEach(producto => {
    total += producto.precio;
    mensaje +=
      "\n\u2022 " + reloj1 + " " + producto.nombre +
      "\n" + dinero + " Precio: $" + producto.precio.toLocaleString('es-CO') +
      "\n" + camara + " Imagen: " + producto.imagen +
      "\n";
  });

  mensaje +=
    "\n" + separador +
    "\n" + billete + " TOTAL DEL PEDIDO: $" + total.toLocaleString('es-CO') +
    "\n\n" + pin + " Datos de entrega:" +
    "\n" + lapiz + " Nombre:" +
    "\n" + tel + " Tel\u00E9fono:" +
    "\n" + casa + " Direcci\u00F3n:" +
    "\n\n" + camion + " Env\u00EDo a domicilio." +
    "\n\n" + brillo + " Gracias por elegir KP RELOJES" +
    "\n" + reloj2 + " Calidad y elegancia en cada detalle.";

  localStorage.setItem("kp_ultimo_total", total);
  localStorage.setItem("kp_ultima_compra", new Date().toISOString());

  const url = "https://wa.me/573008734383?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}
