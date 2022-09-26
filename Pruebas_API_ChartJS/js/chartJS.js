function grafica(datos, etiquetas, area){
    // Obtencion del bloque de html
    const areaGraf = document.querySelector(area);

    // Estableciendo el dataset de la grafica para 2 datos en este caso:
    const dataSetGraf = {
        label: "Estado del usuario",
        data: datos,
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
        borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
        borderWidth: 1// Ancho del borde
    }

    new Chart(areaGraf, {
        type: 'bar',// Tipo de gráfica
        data: {
            labels: etiquetas,
            datasets: [
                dataSetGraf
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            },
        }
    });
}

