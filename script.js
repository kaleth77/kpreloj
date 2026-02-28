function consultar(producto) {
    let numero = "573008734383";
    let mensaje = "Hola, quiero consultar el precio de: " + producto;
    let url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}
