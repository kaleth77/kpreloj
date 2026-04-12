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

// ── Último día del mes actual ────────────────────────────────────────────────
function obtenerFechaFinMes() {
  const hoy = new Date();
  const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  return `${ultimoDia} De ${meses[hoy.getMonth()]}`;
}

// ── Genera imagen usando la original como fondo ──────────────────────────────
function generarImagenRecordatorio(total) {
  const fecha = obtenerFechaFinMes();
  const precioTexto = "$" + total.toLocaleString('es-CO');

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = "https://kaleth77.github.io/kpreloj/img/recordatorio.JPG";

  img.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;   // 1066
    canvas.height = img.height; // 1600
    const ctx = canvas.getContext("2d");

    // 1. Dibujar imagen original completa
    ctx.drawImage(img, 0, 0);

    // 2. Tapar el precio original con rectángulo negro
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(150, 310, 766, 130);

    // 3. Escribir el nuevo precio encima
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 95px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(precioTexto, 533, 415);

    // 4. Tapar la fecha original con rectángulo negro
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(50, 1075, 966, 120);

    // 5. Escribir la nueva fecha encima
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 95px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(fecha, 533, 1170);

    mostrarBotonDescarga(canvas);
  };

  img.onerror = function () {
    alert("No se pudo cargar la imagen. Verifica que recordatorio.JPG esté en la carpeta img de GitHub.");
  };
}

// ── Modal con vista previa y botón descargar ─────────────────────────────────
function mostrarBotonDescarga(canvas) {
  const existing = document.getElementById("kp-descarga-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "kp-descarga-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.88);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
  `;

  const preview = document.createElement("img");
  preview.src = canvas.toDataURL("image/jpeg", 0.95);
  preview.style.cssText = `
    max-height: 65vh;
    max-width: 90vw;
    border: 2px solid #c8960c;
    border-radius: 8px;
  `;

  const btnDescargar = document.createElement("a");
  btnDescargar.href = canvas.toDataURL("image/jpeg", 0.95);
  btnDescargar.download = "recordatorio_kp.jpg";
  btnDescargar.textContent = "⬇️ Descargar imagen";
  btnDescargar.style.cssText = `
    background: linear-gradient(135deg, #c8960c, #f5d060, #b8860b);
    color: #000;
    font-weight: bold;
    font-size: 20px;
    padding: 14px 36px;
    border-radius: 8px;
    text-decoration: none;
  `;

  const btnCerrar = document.createElement("button");
  btnCerrar.textContent = "✕ Cerrar";
  btnCerrar.style.cssText = `
    background: transparent;
    color: #aaa;
    border: 1px solid #555;
    font-size: 16px;
    padding: 10px 28px;
    border-radius: 8px;
    cursor: pointer;
  `;
  btnCerrar.onclick = () => overlay.remove();

  overlay.appendChild(preview);
  overlay.appendChild(btnDescargar);
  overlay.appendChild(btnCerrar);
  document.body.appendChild(overlay);
}

// ── Comprar por WhatsApp ─────────────────────────────────────────────────────
function comprarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  let mensaje = "🛒 PEDIDO KP\n\n";
  mensaje += "📦 Productos:\n\n";

  let total = 0;

  carrito.forEach(producto => {
    mensaje += "• " + producto.nombre +
               " - $" + producto.precio.toLocaleString('es-CO') +
               "\n🔗 Imagen: " + producto.imagen +
               "\n\n";
    total += producto.precio;
  });

  mensaje += "💰 Total: $" + total.toLocaleString('es-CO');
  mensaje += "\n\n📍 Enviar datos de entrega.";

  const url = "https://wa.me/573008734383?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");

  // Generar imagen con el total real del pedido
  generarImagenRecordatorio(total);

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

document.addEventListener("DOMContentLoaded", actualizarCarrito);
