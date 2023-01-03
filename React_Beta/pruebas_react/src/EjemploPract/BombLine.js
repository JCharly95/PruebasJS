// ** Third Party Components
import axios from 'axios';
import Chart from 'react-apexcharts';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/material_blue.css";
import React, { useEffect, useState, useRef } from 'react';

// Metodo burbuja para el ordenamiento de datos de la grafica
/*function burbuja(arrInfo) {
    let contInte, contExte, aux;
    const n = arrInfo.length;
  
    // Algoritmo de burbuja
    for (contExte = 1; contExte < n; contExte++) {
      for (contInte = 0; contInte < (n - contExte); contInte++) {
        if (arrInfo[contInte][0] > arrInfo[contInte + 1][0]) {
            aux = arrInfo[contInte];
            arrInfo[contInte] = arrInfo[contInte + 1];
            arrInfo[contInte + 1] = aux;
        }
      }
    }
  }*/

export default function BombLine_BMS (){
    const arrVals = [], info = [];
//------------------------------Estableciendo las variables de trabajo-----------------------------------------
    // Variable de estado para la obtencion de registros
    const [metadata, setMetadata] = useState([1]);

    // Establecer las variables de las fechas
    const [fechIni, setFechIni] = useState(Date.now());
    const [fechFin, setFechFin] = useState(Date.now());
    // Aqui se ingresara que tipo de registros se desea buscar
    let infoBus = "/niagaratest/L3$20$2d$20L1";
    // Para este ejemplo la muestra contempla registros desde el 15 de marzo a las 2:09 pm hasta el 14 de julio a las 4:48 pm
//-------------------------------------------------------------------------------------------------------------
//-------------------------Peticion con Axios para obtener la informacion--------------------------------------
    useEffect(() => {
        const obteInfo = async (estado) => {
            const peticion = await axios.get('https://bms.controldigital.mx/data2.php');
            //const peticion = await axios.get('data.json')
            estado(peticion.data);
        }
        obteInfo(setMetadata);
    }, []);
    if (!metadata)
        console.log("Ocurrio un problema en la obtencion de la informacion");
//-------------------------------------------------------------------------------------------------------------
//-----------Obtencion de todos los registros que coincidan con el nombre/identificador de busqueda------------
    // Por ejemplo: en este caso es la linea 3
    const regsBusqueda = [];
    metadata.map(
        (info) => (
            (`${info.HISTORY_ID}`.includes(infoBus)) ? regsBusqueda.push(
                {
                    ID: parseInt(`${info.ID}`),
                    DATE: (new Date(parseInt(`${info.TIMESTAMP}`))),
                    VALUE: parseFloat(parseFloat(`${info.VALUE}`).toFixed(2))
                }
            ) : null
        )
    );
//-------------------------------------Preparacion de Flatpickr------------------------------------------------
    const fechIniSel = useRef(null), fechFinSel = useRef(null);
    let fechIngreIni, fechIngreFin;
    const optionsInicial = {
        altInput: true,
        enableTime: true,
        altFormat: "Y/m/d; H:i",
        dateFormat: 'Y-m-d H:i',
        defaultDate: Date.now(),
        onClose: function(selectedDates, dateSel) {
            fechIngreIni=new Date(dateSel);
            setFechIni(fechIngreIni);
            console.log("Fecha de Inicio Seleccionada:", fechIngreIni);
        }
    };
    const optionsFinal = {
        altInput: true,
        enableTime: true,
        altFormat: "Y/m/d; H:i",
        dateFormat: "Y-m-d H:i",
        defaultDate: Date.now(),
        onClose: function(selectedDates, dateSel) {
            fechIngreFin=new Date(dateSel);
            setFechFin(fechIngreFin);
            console.log("Fecha de Fin Seleccionada:", fechIngreFin);
            console.log("Arreglo de informacion para la grafica", info);
        }
    };
//-------------------------------------------------------------------------------------------------------------
//-------------------------Calculando el valor promedio de los registros---------------------------------------
    // Obteniendo el valor promedio de valores
    regsBusqueda.map((reg) => ( arrVals.push(reg.VALUE) ));
    
    if(arrVals.length > 0){
        const promedio = parseFloat((arrVals.reduce((valPrev, valAct) => valAct += valPrev) / arrVals.length).toFixed(2));

        regsBusqueda.map(function(registro) {
            const fecha = registro.DATE, valor = registro.VALUE;
            /* Ya que el promedio depende del resultado de la consulta solo en este punto se puede hacer el filtrado de datos junto con el parametro del promedio.
            Entonces si la fecha se comprende entre la inicial y la final, ademas de ser mayor al promedio (para que no haya tantos registros) se incoporara el registro al arreglo de valores para la grafica*/
            if(fecha > fechIni && fecha < fechFin && valor > promedio)
                info.push([fecha, valor])

            return 0;
        });
    }
//-------------------------------------------------------------------------------------------------------------
//------------------------------Preparacion de valores para la grafica-----------------------------------------
    /*const info = metadata.map(
        function(registro) {
            // Filtro del nombre del registro para la grafica
            const regID = `${registro.HISTORY_ID}`.includes(infoBus);
            // Fecha UNIX del registro (timestamp)
            const fechReg = new Date(`${registro.TIMESTAMP}`.substring(0, `${registro.TIMESTAMP}`.length - 3) * 1000)
            const valReg = parseFloat(`${registro.VALUE}`).toFixed(2)
            
            // Si el nombre del registro coincidio con el de la busqueda, el valor de este es mayor al promedio y se encuentra en rango con la fecha, se agrega como dato al arreglo de valores de la grafica
            if (regID && (valReg > promedio) && (fechReg > fechIni) && (fechReg < fechFin)) 
                return [fechReg, valReg]

            return 0
        }
    );*/
//-------------------------------------------------------------------------------------------------------------
    // Ordenamiento de datos
    //burbuja(info)

    /*const info = metadata.map((reg, index) => (
        (index < 10) ? [new Date(`${reg.TIMESTAMP}`.substring(0, `${reg.TIMESTAMP}`.length - 3) * 1000), parseFloat(`${reg.VALUE}`).toFixed(2)] : 0
    ));*/

    // Pasando todos los valores
    /*const info = metadata.map((reg) => (
        [new Date(`${reg.TIMESTAMP}`.substring(0, `${reg.TIMESTAMP}`.length - 3) * 1000), parseFloat(`${reg.VALUE}`).toFixed(2)]
    ));*/
    
    const dataSeries = [
        {
            name: "Registros BMS",
            data: info
        }
    ];

    const options = {
        chart: {
            height: "70%",
            type: "line",
            animations: {
                initialAnimation: {
                    enabled: false
                }
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: {
            labels: {
              offsetX: 24,
              offsetY: -5
            },
            tooltip: {
              enabled: true
            }
        },
        tooltip: {
            x: {
              format: "dd MMM yyyy; HH:ss"
            },
        },
        noData: {
            text: 'Informacion no disponible, seleccione un rango valido'
        }
    };

    return (
        <div>
            <div id="CalenGrafSel">
                <p>
                    &nbsp; Seleccionar Fecha de inicio: &nbsp;
                    <Flatpickr ref={fechIniSel} options={optionsInicial} />
                    <button type="button" onClick={() => {
                        if (!fechIniSel?.current?.flatpickr) return;
                            fechIniSel.current.flatpickr.clear();
                        }
                    }>
                    Limpiar Seleccion
                    </button>
                    &nbsp; Seleccionar Fecha de fin: &nbsp;
                    <Flatpickr ref={fechFinSel} options={optionsFinal} />
                    <button type="button" onClick={() => {
                        if (!fechFinSel?.current?.flatpickr) return;
                            fechFinSel.current.flatpickr.clear();
                        }
                    }>
                    Limpiar Seleccion
                    </button>
                </p>
            </div>
            <div id="chart">
                <Chart options={options} series={dataSeries} type="line" />
            </div>
        </div>
    );
}