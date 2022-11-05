//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//Eventos
evenList();

function evenList () {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    
    document.addEventListener('submit', agregarGasto);
}


//Clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        // señalar al objeto principal con this
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        //reduce toma dos argumentos 
        //reduce suma los valores que se vayan acumulando
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0)
        
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad){
        // Extrayendo los valores
        const {presupuesto, restante} = cantidad;

        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;

    }

    imprimirAlerta(mensaje, tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error' ){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario); // insertBefore toma dos argumentos

        // quitar el mensaje
        setTimeout(() =>{
            divMensaje.remove();
        },2500);

    }

    mostrarGastos(gastos){
        //limpiar el HTLM previo
        this.limpiarHTML();

        //iterar sobre los gastos
        gastos.forEach( gastos => {
            const { cantidad, nombre, id } = gastos;


            //crear li
            const nuevoGasto = document.createElement('li');
            //class list reporta que clases hay + add y remove y class name asigna el valor 
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            //nuevoGasto.setAttribute('data-id', id);
            //nueva version
            nuevoGasto.dataset.id = id;

            // agregar el HTLM del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            // des esta forma hasta que le de click llama la funcion
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al HTLM
            gastoListado.appendChild(nuevoGasto);


        });
    }
    // forma optima de limpiar el registro de los appendchild
    limpiarHTML(){
        while ( gastoListado.firstChild ){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestObj){
        const { presupuesto, restante } = presupuestObj;
        

        const restanteDiv = document.querySelector('.restante');
        //comprobar el 25% si tengo 100 / 4 = 25
        // si 25 es mayor al restante ya hemos gastado mas del 75%
        if((presupuesto / 4 ) > restante){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.remove('alert-warning');
        } else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es 0 o menor
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }else {
            formulario.querySelector('button[type="submit"]').disabled = false;
        }
    }
}

//instanciar el presupuesto 
const ui = new UI();
let presupuesto;


//Funciones

function preguntarPresupuesto () {
    const presupuestoUser = prompt ('¿Cual es tu presupuesto?');

    //console.log( Number (presupuestoUser));

    if (presupuestoUser === '' || presupuestoUser === 'null' || presupuestoUser <= 0 || isNaN(presupuestoUser)) {
    // si las validaciobes son incorrectas recargara la pregunta
    
    window.location.reload();

    }   
    
    //Presupuesto valido
    presupuesto = new Presupuesto(presupuestoUser);

    ui.insertarPresupuesto(presupuesto);

}

// añade los gastos
function agregarGasto(e) {
    e.preventDefault();


    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number( document.querySelector('#cantidad').value);


    //Validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantiadad no valida', 'error');
        return;
    }


    // generar un objeto con el gasto
    //une nombre y cantidad a gasto
    const gasto = { nombre, cantidad,id: Date.now() }

    // añade nuevo gasto
    presupuesto.nuevoGasto( gasto );

    //mensaje de todo bien
    ui.imprimirAlerta('Gasto agregado correctamente');


    //imprimir gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos( gastos );

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){
    // elimina del objeto
    presupuesto.eliminarGasto(id);


    // elimina los gastos del html
    const {gastos, restante} = presupuesto;
    
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}