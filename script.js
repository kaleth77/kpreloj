function consultar(producto, precioTexto) {
    let numero = "573008734383";
    let mensaje = "Hola, quiero consultar por: " + producto;
    if (precioTexto) {
        mensaje += " (" + precioTexto + ")";
    }
    let url = "https://wa.me/" + numero + "?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}
