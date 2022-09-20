//creo las variables globales para las funciones
//variable global para el valor del dolar
const valorDll = 300


//variable global para la validacion del formulario
let pverdadero = false



//creo las variables para los eventos
const addBtn = document.getElementById("addBtn");
const form = document.getElementById("form");
const verBtn = document.getElementById("verBtn");
const formulario = document.getElementById("formulario");
const articulos = document.getElementById("articulos");
const contadorCarrito = document.getElementById("contadorCarrito");
const btnVaciar = document.getElementById("btnVaciar")
const btnComprar = document.getElementById("btnComprar");
const productosDOM = document.getElementById("productosDOM");


//creo el array que va a contener los productos traidos del productos.json
let productos = [];

//creo el array vacio con los productos que se van a agregar al carrito
let carrito = [];



//FUNCIONES!!

//creo una funcion que muestra los articulos del productos.json en el DOM
const renderProducts = () =>{
    productos.forEach(element => {
        productosDOM.innerHTML +=`
        <div class="productos" id="producto">
                <img src="${element.img}" alt="${element.nombre}">
                <h2 id="nombre">${element.nombre}</h2>
                <h3 id="precio">U$D ${element.precioDol} </h3>
                <p><strong id="detalle">Detalles: ${element.detalle}.</strong></p>
                <button type="submit" id="btnNotebook" onclick="sumarAlCarrito(${element.id})">Comprar</button>
            </div>
        `
    });
}

//traigo los datos de los productos mediante fetch
const obtenerDatos = async () =>{
    try{
        const res = await fetch(`./productos.json`);
        const data = await res.json();
        productos = data;
        console.log(productos)
        //llamo a la funcion renderProducts para mostrar los productos
        renderProducts();
    }catch (error){
        console.log(error)
    }
}



const sumarAlCarrito = (itemId) => {
    //creo una variable utilizando el metodo .some para saber si ya esta agregado al carrito el producto que se selecciono
    const existe = carrito.some(articulo => articulo.id === itemId);
    //creo el condicional
    if(existe){
        //uso el metodo .map para que encuentre cual es el producto que ya esta agregado y asi, sumarle la cantidad al hacer click devuelta
        carrito.map(prod => {
            if(prod.id === itemId){
                prod.cantidad++
            }
        })
    }else{
        const item = productos.find((item)=> item.id === itemId);
        carrito.push(item);
    }
    //llamo a la funcion que le avisa al usuario que se agrego un producto
    alertaCarrito();
    //llamo devuelta a la funcion actualizar carrito
    actualizarCarrito();
}

//creo la funcion actualizar carrito que modifica el DOM dentro del modal
const actualizarCarrito = () =>{
    //inicializo el DOM del modal vacio
    articulos.innerHTML = "";
    for (const dato of carrito) {
        let producto = document.createElement("div");
        producto.innerHTML = `<div class="cuerpoModal">
        <img src="${dato.img}" alt="${dato.alt}">
        <span class="detallesModal">
        <h2 id="nombre">${dato.nombre}</h2>
        <p>Cantidad: ${dato.cantidad}</p>
        <h3 id="precio">U$D ${dato.precioDol * dato.cantidad}</h3>
        <p><strong id="detalle">Detalles: ${dato.detalle}</strong></p></span>
        <button onclick="eliminarDelCarrito(${dato.id})" class="btnEliminar"><img src="./img/borrar-plugins-wordpress.png" alt="imagen de tacho de basura"></button>`;
        articulos.appendChild(producto);
        //Me almaceno en el localStorage los articulos
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
    //uso el .innerText para que cada vez que se agrega un articulo, se sume el numero que aparece en el icono del carrito
    contadorCarrito.innerText = carrito.reduce((acc, element) => acc + element.cantidad, 0);
    //llamo a que se ejecute la funcion que agrega el valor en dolares y en pesos de los totales
    valorDolares();
}

//creo una funcion usando la libreria Toastify para que le avise al usuario que se agrego un producto al carrito
const alertaCarrito = () => {
    Toastify({
        text: "Producto agregado al carrito",
        duration: 2000,
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
}

//creo la funcion para eliminar un producto individual del carrito
const eliminarDelCarrito = (prodId) => {
    //utilizo el metodo .find para que encuentre el articulo que se quiere eliminar mediante el id
    const itemDelCarrito = carrito.find((prod) => prod.id === prodId);
    //busco el indice de ese articulo y lo almaceno en una variable
    const indice = carrito.indexOf(itemDelCarrito);
    //uso el metodo .splice para que elimine del carrito el articulo 
    carrito.splice(indice, 1);
    //Vuelvo a poner la cantidad del articulo en 1
    itemDelCarrito.cantidad = 1;
    //remuevo el item del local storage para que no quede almacenado al actualizarse
    localStorage.removeItem("carrito");
    //actualizo el DOM del modal
    actualizarCarrito();

}


//creo una funcion para que el usuario me confirme si quiere vaciar el carrito utilizando la libreria sweetalert 
const confirmacionVaciar = (carrito) =>{
    if(carrito.length == 0){
        swal({
            title: "Error",
            text: "No hay productos agregados al carrito",
            icon: "error",
            button: "Cerrar",
        })
    } else{
        swal({
            title: "¿Estas seguro?",
            text: "Desea eliminar los productos?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((aceptar) => {
            if (aceptar) {
              swal("Se vacio el carrito!", {
                icon: "success",
              }
              )
                carrito.length = 0;
                localStorage.removeItem("carrito");
                actualizarCarrito();
                ;
            } else {
              swal({
                text: "No se vacio el carrito",
                icon: "error",
            });
            }
          });
    }
}

//creo una funcion para que le muestre una alerta al usuario que su compra ha sido exitosa o no al tocar el boton "comprar"
const pagarCompra = () =>{
    if(carrito.length == 0){
        swal({
            title: "Error",
            text: "No hay productos agregados al carrito, por favor selecciona uno!",
            icon: "error",
            button: "Cerrar",
        })
    }else{
        swal({
            title: "Compra Exitosa",
            text: "¡Gracias por confiar en nosotros!",
            icon: "success",
            button: "Cerrar",
          })
    }
}


//creo la funcion que valida los datos del formulario
const validarDatos = (nombre, precio, detalle) => {
    (nombre === "") || (precio === "") || (detalle === "") ? pverdadero = true : pverdadero = false;
}

//creo una funcion la cual me permite validar si los campos del formulario fueron completados o no.
const consultaArticulos = (e) => {
    e.preventDefault();
    let producto = form.children[0].value;
    let detalle = form.children[1].value;
    let email = form.children[2].value;
    let completeLosCampos = document.createElement("div");
    completeLosCampos.innerHTML = `<div class="completar" id="resultado"></div>`
    form.append(completeLosCampos);
    let p = document.getElementById("resultado");
    validarDatos(producto, detalle, email);
    (pverdadero == false) ? camposCompletados(p, producto, detalle, email) : camposIncompletos(p);

}

//creo una funcion que almacena en el local storage los datos ingresados en el form
const camposCompletados = (resultado, producto, detalle, email) =>{
    resultado.remove();
    localStorage.setItem("nombreProducto", producto);
    localStorage.setItem("detalle", detalle);
    localStorage.setItem("email", email);
    datosEnviados();

}

//creo una funcion que agrega en el DOM un aviso al usuario para que complete todos los campos
const camposIncompletos = (resultado) =>{
    while(pverdadero == true){
        resultado.innerText = `Complete todos los campos!`
        validarDatos(producto, detalle, email);
        break
    }
}

//creo un aviso con sweetalert para indicarle al usuario que se lo va a contactar
const datosEnviados = () =>{
    swal({
        title: "Datos enviados!",
        text: `Se enviara un mail a tu correo ${localStorage.getItem("email").toUpperCase()} con los datos de tu producto ${localStorage.getItem("nombreProducto").toUpperCase()}`,
        icon: "success",
        button: "Cerrar",
      });
}

//creo la funcion que me suma el precio total de los productos utilizando el metodo .reduce
function valorDolares(){
    const valorSubtotalDol = carrito.reduce((acc, element) => acc + element.precioDol, 0);
    let totalDol = document.createElement("p");
    totalDol.innerHTML = `<p class="precioProducto">Precio a pagar en dolares: $${valorSubtotalDol} <br> Precio a pagar en pesos: $${arsConImpuestos(valorSubtotalDol)}</p>`
    articulos.appendChild(totalDol);
}

//creo una funcion que me convierte el precio de dolares a pesos
const arsConImpuestos = (subtotalDol) => {return ((subtotalDol *= valorDll) * 1.75).toFixed(2)};


//llamo a la funcion
obtenerDatos();

//EVENTOS
addBtn.onclick = consultaArticulos;
btnVaciar.addEventListener("click", () =>{
    confirmacionVaciar(carrito);
});
btnComprar.onclick = pagarCompra;
//uso el local storage para que me almacene los articulos ingresados al carrito aunque el usuario haga un refresh a la pagina
document.addEventListener("DOMContentLoaded", () =>{
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        actualizarCarrito();
    }
});



