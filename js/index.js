//Variables de atajo
const cl = console.log
const q = document.querySelector.bind(document)


//Funcion principal, cuando el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    pintarHelados();
    pintarCarrito();
});


//Fetch Obteber de JSON
const getHelados = () => {
    const URL = "https://kevineramos.github.io/happyice/productos.json";
    return fetch(URL).
        then(response => response.json())
        .then(data => data)
        .catch(error => cl(error))
}

//Pinta Cada helado del JSON en HTML
const pintarHelados = async () => {
    let helados = await getHelados();
    // cl(helados);
    html = '';
    helados.forEach(helado => {
        // cl(helado);
        html += `
        <div class="card col-12  col-md-4 col-lg-3 crece  m-0 p-0 "  style="width: 18rem;">
            <div class="m-1 card-product">
                <img src="${helado.imagen}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h4 class="card-title h4 text-center text-info">${helado.nombre}</h5>
                    <h5 class="card-title">S/.${helado.precio}</h5>
                    <p class="card-text">${helado.info}</p>
                    <a href="#" class="btn crece-btn" id="añadir" onclick="añadirCarrito(${helado.id})">AÑADIR</a>
                </div>
            </div>            
        </div> 
        `;
    });
    q('#contenido').innerHTML = html;
}

//Añade al carrito segun el id desde JSON- usado en cada Boton "añadir a cesta"
const añadirCarrito = (id) => {
    window.event.preventDefault();
    let arrayLS = obtenerLocalStorage();

    arrayLS.push(id);
    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);

    //Abre el carrito cada vez que presiona el botons
    abrir();
}

//Abrir el div del carrito - cambia de display al div
const abrir = () => {
    const containerCart = q("#pintarCarrito");

    containerCart.classList.forEach(clase => {
        if (clase === "d-none") {
            containerCart.classList.remove("d-none");
            containerCart.classList.add("d-block");
            pintarCarrito();
        }

        if (clase === "d-block") {
            pintarCarrito();
        }
    });
}


//Obtiene del LS y devuelve un array de ID's
const obtenerLocalStorage = () => {
    let arrayLS = [];
    let LS = localStorage.getItem("productos");
    //cl(LS);
    if (LS == null) {
        arrayLS = [];
    } else {
        arrayLS = JSON.parse(localStorage.getItem("productos"));
            //cl(arrayLS)
    }
    return arrayLS;
}

//Abre y cierra, segun display del div de carrito
const cerrarAbrirCarrito = () => {
    cl(window.event.type);
    const containerCart = q("#pintarCarrito");

    containerCart.classList.forEach(clase => {
        if (clase === "d-none") {
            containerCart.classList.remove("d-none");
            containerCart.classList.add("d-block");
            pintarCarrito();
        }

        if (clase === "d-block") {
            containerCart.classList.remove("d-block");
            containerCart.classList.add("d-none");
        }
    });
}

//Elimiina duplicados de un Array
const noDuplicados = (arr)=>{ 
    let arrNoDup  = Array.from(new Set(arr));
    return arrNoDup;
}

//Captura Json y LS (pinta ID que coinciden) - devuelve un array con la orden
const pintarCarrito = async () => {

    let total = 0; // monto total
    let orden = []; //array con objeto de cada producto ordenado
    let obj = {}; //producto en la orden

    let contenido = q('#pintarCarrito');
    let heladosJson = await getHelados(); //json
    let productosLS = obtenerLocalStorage(); //LocalStorage
    html = `                    
            <div class="container justify-content-center">
                <div class="row py-2">
                    <div class="col p-0 text-center">
                        <p class="h6 text-white">Productos Seleccionados</p>
                    </div>   
                </div>   
            </div>`;
   
    //Eliminar duplicados del array del LS
    let prodNoDupLS = noDuplicados(productosLS);
    //let prodNoDupLS = Array.from(new Set(productosLS));
    //console.log(prodNoDupLS);

    

    //Recorrer si coinciden los ID's JSON con el Array no duplicado
    prodNoDupLS.forEach(iLS => {

        heladosJson.forEach(helado => {
            if (helado.id == iLS) {

                //Cuenta duplicados
                let contador = contarDuplicadoLS(productosLS, iLS);

                //Precio unitario * numero de duplicados
                total += parseFloat((helado.precio * contador));
                // cl(typeof total, total);

                //Metiendo datos en objeto
                obj = {
                    cantidad: contador,
                    nombre: helado.nombre,
                    precio: helado.precio * contador
                };

                //Metiendo cada objeto en array
                orden.push(obj);


                //Pintando en el div del carrito
                html += `
                    <div class="container">
                        <div class="row py-2">
                            <div class="col-1 p-0 text-center" id="cantidad">
                                <span class="badge badge-info">${contador}</span>
                            </div>
                            <div class="col-1 p-0"><img src="${helado.imagen}" class="img-fluid"></div>
                            <div class="col-2 p-0 text-center text-info">${helado.nombre}</div>
                            <div class="col-3 p-0 text-center text-info" id="precio">S/ ${(helado.precio * contador).toFixed(2)}</div>
                            <div class="col-1 mx-1">
                                <button class="btn btn-outline-success" onclick="incrementar(${iLS})"><i class="fas fa-plus text-success"></i></button>
                            </div>
                            <div class="col-1 mx-1">
                                <button onclick="decrementar(${iLS})" class="btn btn-outline-warning" onclick=""><i class="fas fa-minus"></i></button>
                            </div>
                            <div class="col-1 mx-1">
                                <button onclick="eliminarProductoLS(${iLS})" class="btn btn-outline-danger" ><i class="fas fa-trash-alt text-danger border-0"></i></button>
                            </div>
                        </div>
                        
                        
                    </div>
                    `;
            }
        });

    });

    //Obeniendo array ordenes
    var ordenPedido = orden;
        //cl(ordenPedido)


    //Pintando Total en la parte inferior del carrito
    html += `
            <div class="container">
                <div class="row py-2">
                    <div class="col-12 py-2 text-center">
                        <h1 class="text-white">Total: S/. ${total.toFixed(2)}</h1>                 
                    </div>
                    <div class="col-12 py-2">
                        <button onclick="pedido(${total})" 
                        data-toggle="modal" data-target="#modal-orden"
                        class="w-100 btn btn-outline-success" >Confirmar</button> 
                    </div> 
                </div>      
            </div>
            <div class="container">
                <div class="row py-2">
                    <button onclick="deleteAll()" class="btn btn-outline-danger ml-2" >Vaciar Carrito</button>
                </div>      
            </div>
            `;
    //cl(total.toFixed(2), "prueba");
    //cl(prodNoDupLS)

    //En caso el carrito este vacio, pintara esto en el div
    if (prodNoDupLS.length == 0) {
        contenido.innerHTML = '<p class="h1 text-center text-danger">añadir productos al carrito<i class="fas fa-cart-arrow-down"></i></p>';
    } else {
        contenido.innerHTML = html;
    }

    //Devolviendo array de orden
    return ordenPedido;
}

//Cuenta duplicados en un array (array - id) -usar dentro de un ciclo para sacar el id
const contarDuplicadoLS = (duplicado, id) => {
    let count = 0;
    // cl(duplicado);
    // cl(id);

    duplicado.forEach(indice => {
        if (indice == id) {
            count++;
        }
    });
    return count;
}

//Obtiene el array del LS, elimina elemento del array y vuelve a insertar el array en el LS
const eliminarUnoLS = (id) => {

    //obtener de LS
    let arrayLS = obtenerLocalStorage();
        //cl(arrayLS);

    let pos = arrayLS.indexOf(id);
    arrayLS.splice(pos, 1);

    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);
}

//Elimina todos los id que coincidan de un prodcuto
const eliminarProductoLS = (id) => {
    //cl('eliminar todo', id)

    let arrayLS = obtenerLocalStorage();

    //Elimna todos los id que coinciden
    let arrayElimTodo = arrayLS.filter(item => {
        return item != id;
    });

    let cadena = JSON.stringify(arrayElimTodo);
    localStorage.setItem("productos", cadena);

    pintarCarrito();
}

//Incrementa un prodcuto en una unidad
const incrementar = (id) => {

    let arrayLS = obtenerLocalStorage();

    arrayLS.push(id);

    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);
    pintarCarrito();
}

//Eliminar un producto en una unidad
const decrementar = (id) => {
    let arrayLS = obtenerLocalStorage();

    arrayLS.pop();
    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);
    pintarCarrito();
}

//Borra el carrito completo del LS
const deleteAll = () => {
    localStorage.clear();
    pintarCarrito();
}


//Pinta pedido en el modal - Pasa el valor del total al LS
const pedido = async (total) => {
    cerrarAbrirCarrito();

    let table = q('#table-content');
    let precio = q('#price');
        //cl(precio)
    let orden = await pintarCarrito();
    //cl(orden)
    let html = '';

    orden.forEach(prod => {
        html += `
        <tr>
            <th scope="row">${prod.cantidad}</th>
            <td>${prod.nombre}</td>
            <td>S/. ${(prod.precio).toFixed(2)}</td>
        </tr>
        `;
    });

    let cadPrice = `
        <div class="container">
            <div class="row text-center align-items-center">
                <div class="col-6 h4">
                    El monto total es 
                </div>
                <div class="col-6 align-items-center">
                    <strong class="display-4">S/ ${total.toFixed(2)}</strong>
                </div>
            </div>
        </div>`;

    
    table.innerHTML = html;
    precio.innerHTML = cadPrice;

    //Pasar Total al LS
    let montoTotal = total.toFixed(2);
    localStorage.setItem('total',montoTotal);
}


//Recoge array con la orden de pintarCarito() - y envia los datos a Whatsapp
const sendOrden = async (e) => {

    let ped = await pintarCarrito();
    // e.preventDefault();

    //Taer Total del LS
    let monto = localStorage.getItem('total');
    //cl(monto)

    let parr = q('#info-cli');//boton de enviar a wsp
    let nombre = q('#nombre').value;
    let celular = q('#celular').value;
    let direccion = q('#direccion').value;

    //Creando cadena de datos para insertar en parrafo y PDF
    let  datosCliente = `<h5 class="text-center h2 text-success">Cliente: ${nombre} Contacto:  ${celular} ${direccion}</h5>`;


    let cadena = JSON.stringify(ped);
    cl(cadena);

    if (nombre.length <= 0 || celular.length <= 7 || celular.length > 9 || direccion.length <= 0) {
        alert('Ingrese sus datos correctamente')
    } else {
        let respuesta = confirm('Para finalizar el pedido debe realizar el pago en los numeros de cuenta y enviar el comprobante por whatsapp');

        if (respuesta) {
            parr.innerHTML = datosCliente;
            //Generar PDF
            HTMLtoPDF();

            let evt = `https://api.whatsapp.com/send?phone=51970344480&text=Hola!%20soy%20${nombre}%20realice%20un%20pedido%20desde%20la%20web!%20Esta%20es%20mi%20direccion%20"%20${direccion}%20"%20y%20mi%20celular%20${celular}%20${cadena}%20con%20un%20total%20de%20${monto}`;

            window.open(evt, '_blank');
            // window.location.href = evt;
        }
    }
}



//Generar un PDF
const HTMLtoPDF = () => {

	var pdf = new jsPDF('p', 'pt', 'letter');
	source = $('#HTMLtoPDF')[0];
	specialElementHandlers = {
		'#bypassme': function (element, renderer) {
			return true
		}
	}
	margins = {
		top: 50,
		left: 60,
		width: 545
	};
	pdf.fromHTML(
		source // HTML string or DOM elem ref.
		, margins.left // x coord
		, margins.top // y coord
		, {
			'width': margins.width // max width of content on PDF
			, 'elementHandlers': specialElementHandlers
		},
		function (dispose) {
			// dispose: object with X, Y of the last line add to the PDF
			//          this allow the insertion of new lines after html
			pdf.save('miOrden.pdf');
		}
	)
}