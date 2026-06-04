console.log("Carrito KP conectado");

let carrito = JSON.parse(localStorage.getItem("kp_carrito")) || [];

function guardarCarrito() {
  localStorage.setItem("kp_carrito", JSON.stringify(carrito));
}

function abrirCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) modal.style.display = "flex";
}

function cerrarCarrito() {
  const modal = document.getElementById("modal-carrito");
  if (modal) modal.style.display = "none";
}

function agregarAlCarrito(nombre, precio, imagen) {
  carrito.push({ nombre, precio: Number(precio), imagen });
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
          ${String.fromCodePoint(0x1F4B0)} $${producto.precio.toLocaleString('es-CO')}<br><br>
          <button onclick="eliminarDelCarrito(${index})">
            ${String.fromCodePoint(0x274C)} Eliminar
          </button>
        </div>
      `;
    });
    if (totalElemento) totalElemento.textContent = total.toLocaleString('es-CO');
  }
  if (contador) contador.textContent = carrito.length;
}

function comprarWhatsApp() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  var e = String.fromCodePoint;
  var bolsa    = e(0x1F6D2);
  var reloj    = e(0x231A);
  var reloj2   = e(0x1F570);
  var paquete  = e(0x1F4E6);
  var dinero   = e(0x1F4B0);
  var billete  = e(0x1F4B5);
  var camara   = e(0x1F4F8);
  var pin      = e(0x1F4CD);
  var lapiz    = e(0x270D);
  var tel      = e(0x1F4DE);
  var casa     = e(0x1F3E0);
  var camion   = e(0x1F69A);
  var brillo   = e(0x2728);
  var sep      = "——————————————";

  let mensaje = bolsa + " NUEVO PEDIDO - KP RELOJES " + reloj + "\n\n"
              + paquete + " Productos seleccionados:\n";

  let total = 0;
  carrito.forEach(function(producto) {
    total += producto.precio;
    mensaje += "\n" + reloj + " " + producto.nombre
             + "\n" + dinero + " Precio: $" + producto.precio.toLocaleString('es-CO')
             + "\n" + camara + " Imagen: " + producto.imagen
             + "\n";
  });

  mensaje += "\n" + sep
           + "\n" + billete + " TOTAL DEL PEDIDO: $" + total.toLocaleString('es-CO')
           + "\n\n" + pin + " Datos de entrega:"
           + "\n" + lapiz + " Nombre:"
           + "\n" + tel + " Telefono:"
           + "\n" + casa + " Direccion:"
           + "\n\n" + camion + " Envio a domicilio."
           + "\n\n" + brillo + " Gracias por elegir KP RELOJES"
           + "\n" + reloj2 + " Calidad y elegancia en cada detalle.";

  localStorage.setItem("kp_ultimo_total", total);
  localStorage.setItem("kp_ultima_compra", new Date().toISOString());

  const url = "https://wa.me/573008734383?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}

document.addEventListener("DOMContentLoaded", actualizarCarrito);
