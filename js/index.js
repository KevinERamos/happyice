const cl = console.log
const q = document.querySelector.bind(document)


document.addEventListener('DOMContentLoaded', () => {
    pintarHelados();
    pintarCarrito();
});


const getHelados = () => {
    const URL = "productos.json";
    return fetch(URL).
        then(response => response.json())
        .then(data => data)
        .catch(error => cl(error))
}

const pintarHelados = async () => {
    let helados = await getHelados();
    //cl(helados);
    html = '';
    helados.forEach(helado => {
        //cl(helado);
        html += `
        <div class="card col-12  col-md-4 col-lg-3  bg-transparent border-0 m-0 p-0 "  style="width: 18rem;">
            <div class="m-1 bg-white rounded border border-info">
                <img src="${helado.imagen}" class="card-img-top crece" alt="...">
                <div class="card-body border-top border-info">
                    <h4 class="card-title h4 text-center text-info">${helado.nombre}</h5>
                    <h5 class="card-title">S/.${helado.precio}</h5>
                    <p class="card-text">${helado.info}</p>
                    <a href="#" class="btn btn-warning crece" id="añadir" onclick="añadirCarrito(${helado.id})">Añadir a cesta</a>
                </div>
            </div>            
        </div> 
        `;
    });

    q('#contenido').innerHTML = html;

}

const añadirCarrito = (id) => {
    window.event.preventDefault();
    //confirm("¿Agregar a cesta?");
    let arrayLS = obtenerLocalStorage();

    arrayLS.push(id);
    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);

    abrir();
}

const abrir = ()=>{ 
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

const obtenerLocalStorage = () => {
    let arrayLS = [];
    let LS = localStorage.getItem("productos");
    if (LS == null) {
        arrayLS = [];
    } else {
        arrayLS = JSON.parse(localStorage.getItem("productos"));
    }
    return arrayLS;
}

const cerrarAbrirCarrito = () => {
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

const pintarCarrito = async () => {

    let contenido = q('#pintarCarrito');
    let heladosJson = await getHelados(); //json
    let productosLS = obtenerLocalStorage(); //LocalStorage
    html = "";

    //Eliminar duplicados
    let prodNoDupLS = Array.from(new Set(productosLS));
    //console.log(prodNoDupLS);

    prodNoDupLS.forEach(iLS => {

        heladosJson.forEach(helado => {
            if (helado.id == iLS) {
                let contador = contarDuplicadoLS(productosLS, iLS);

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
                                <button onclick="eliminarTodoLS(${iLS})" class="btn btn-outline-danger" ><i class="fas fa-trash-alt text-danger border-0"></i></button>
                            </div>
                        </div>
                    </div>
                    `;
            }
        });

    });

    //cl(prodNoDupLS)
    if (prodNoDupLS.length == 0) {
        contenido.innerHTML = '<p class="h1 text-center text-danger">Cesta Vacía <i class="fas fa-cart-arrow-down"></i></p>';
    } else {
        contenido.innerHTML = html;
    }


}

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

const eliminarUnoLS = (id) => {
    //Eliminar de LS
    arrayLS = obtenerLocalStorage();
    //cl(arrayLS);

    let pos = arrayLS.indexOf(id);
    arrayLS.splice(pos, 1);

    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);
    //pintarModal();
    //Eliminar de html
    // let elemento = window.event.target;
    // elemento.parentElement.parentElement.parentElement.remove()

}

const eliminarTodoLS = (id) => {
    cl('eliminar todo', id)

    let arrayLS = obtenerLocalStorage();

    //Elimna todos los id que coinciden
    let arrayElimTodo = arrayLS.filter(item => {
        return item != id;
    });

    let cadena = JSON.stringify(arrayElimTodo);
    localStorage.setItem("productos", cadena);

    pintarCarrito();
}


const incrementar = (id) => {

    let arrayLS = obtenerLocalStorage();

    arrayLS.push(id);

    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);
    pintarCarrito();
}

const decrementar = (id) => {
    let arrayLS = obtenerLocalStorage();

    arrayLS.pop();
    let cadena = JSON.stringify(arrayLS);
    localStorage.setItem("productos", cadena);
    pintarCarrito();
}
