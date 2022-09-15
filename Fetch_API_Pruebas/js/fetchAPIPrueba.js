let seccionHTML = document.getElementById("contenido");

fetch('lukeJSON.json')
.then((response) => response.json())
.then((data) => console.log(JSON.stringify(data, null, 4)));