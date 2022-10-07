
/* Este tipo de URLs se conocen como endpoints. Estos son los enlaces de acceso
a las apis desde donde se extraera la informacion.
Por ejemplo: en este caso es la pagina base de jsonplaceholder y
posteriormente con las consultas adecuadas se extraeran multiples datos de la misma
es decir, en lugar de usar un endpoint especifico */
const API_URL = 'https://jsonplaceholder.typicode.com';

// Extraccion y muestreo de datos usando la api de Fetch

/* Primero que nada se crea un nodo raiz para la incrustacion de elementos 
En este caso, el nodo apuntara a una seccion (div) de nuestro html que se usara
para mostrar la informacion */
const HTMLResponse = document.querySelector('#app');

/* Fetch es una API para Javascript con la cuál podemos realizar peticiones HTTP 
asíncronas utilizando promesas y de forma que el código sea un poco más sencillo. */

/* La forma para usar fetch es como una funcion; simplemente se llama a fetch asi:
fetch(url, options);

Donde url, es de donde se obtendra la informacion y 
options es un objeto el cual trae las caracteristicas que se desea obtener con la consulta; los cuales son
method, body, headers y credentials.
Por ejemplo; el method seria un tipo de operacion HTTP: GET, PUT, POST, PULL, etc, que ojo, si no se incluye un valor options
fetch por defecto tomara la operacion GET (metodo de obtener en HTTP) como operacion solicitada. */

/* En este caso, fue la URL de la fake api, pero como variable de JS por eso esta escrita asi.
Fetch regresa una promesa (es un proceso asincrono, como el HTTPRequest de JQuery) y eso se trabaja con then.
La respuesta es captada con la variable (response) y se tiene el metodo para parsear de texto a json con el metodo .json.
Esto a su vez, arroja otra promesa, la cual es captadar por users (en este caso) y es donde se trabajara la informacion: */

/*fetch(`${API_URL}/users`)
    .then((response) => response.json())
    .then((users) =>{
        // Todo lo que se quiera hacer con la informacion obtenida, debe ser tratado dentro de la promesa, porque luego se pierde el acceso a la informacion
        // Este template se usa para recojer los datos, recordar que el .map, es como un foreach compactado
        // OJO: se esta poniendo la informacion dentro de li's porque se pintara la informacion como lista ordenada y estos son sus elementos
        const tpl = users.map(user => `<li>${user.name} ✉ ${user.email}</li>`);
        // Se incrusta la informacion en la pagina como una lista ordenada
        HTMLResponse.innerHTML = `<ul> ${tpl} </ul>`;
});*/

// El codigo anterior fue implementando strings para formatear el HTML, el que sigue es como hacerlo, pero usando elementos de HTML (nodos del DOM de HTML)

// Esto crea un elemento de tipo ul (como los utilizados en react) para poder agregarle hijos o nodos posteriormente
const ul = document.createElement('ul');

fetch(`${API_URL}/users`)
    .then((respuesta) => respuesta.json())
    .then((usuarios) =>{
        // Recordar que al usar usuario => {} se esta creando una funcion flecha pero se esta usando el objeto llamado usuario, mas que nada por la creacion de elementos dentro de el como es el caso del createTextNode
        usuarios.map(user => {
            // Con esto se crea un nodo de tipo li
            let elem = document.createElement('li');
            // A este nodo se le va a pasar un hijo de tipo texto
            // En este caso los valores se pasan como string (pero usando las `` porque se estan trabajando con variables), ya que consiste en un texto de nodo de tipo li
            elem.appendChild(document.createTextNode(`${user.name} ✉ ${user.email}`));
            // Posteriormente al elemento principal se le asigna el hijo con los valores textuales
            ul.appendChild(elem);

            // Y finalmente, el elemento ul se añade como hijo al objeto del DOM creado previamente
            HTMLResponse.appendChild(ul);
        })
});

// Prueba para hacer un fetch que contenga los datos extraidos
const opts = {
    method: 'GET'
};

var aprob=0, nAprob=0, datos, etiquetas;

const consult = fetch(`${API_URL}/todos`, opts)
    .then((respuesta) => respuesta.json())
    .then((res) => {
        res.map(vali => {
            (`${vali.completed}` == 'true') ? aprob++ : nAprob++;
        })

        datos = [aprob, nAprob];
        etiquetas = ["Aprobados", "No Aprobados"];
        
        // Grafica de la informacion
        grafica([aprob], ['Aprobados'], "#canvas1");
        grafica([nAprob], ['No Aprobados'], "#canvas2");

        // Grafica conjunta de la informacion
        grafica(datos, etiquetas, '#canvas3');
    });

// Otra pagina de api descubierta la hacer investigacion es rapidapi
// https://rapidapi.com/collection/list-of-free-apis
