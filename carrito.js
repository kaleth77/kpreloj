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

  let mensaje = "\uD83D\uDED2 PEDIDO KP prueba pa ve \uD83D\uDED2\n\n";
mensaje += "\uD83D\uDCE6 PRODUCTOS:\n\n";

let total = 0;

carrito.forEach(producto => {
  mensaje += "• " + producto.nombre +
             " - $" + producto.precio.toLocaleString('es-CO') +
             "\n\uD83D\uDD17 Imagen: " + producto.imagen +
             "\n\n";
  total += producto.precio;
});

mensaje += "\n\uD83D\uDCB0 TOTAL: $" + total.toLocaleString('es-CO');
mensaje += "\n\n\uD83D\uDCCD Enviar datos de entrega.";

  localStorage.setItem("kp_ultimo_total", total);

  const url = "https://wa.me/573008734383?text=" + encodeURIComponent(mensaje);
  window.open(url, "_blank");

  carrito = [];
  guardarCarrito();
  actualizarCarrito();
}
