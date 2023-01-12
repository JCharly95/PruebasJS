// ** Third Party Components
import axios from 'axios';
import Chart from 'react-apexcharts';
import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/light.css";
import SelFilBus from './dropdown_menu/menu'
import "bootstrap/dist/css/bootstrap.min.css";
import { Search, Calendar, Clock } from 'react-feather'
import React, { useEffect, useState, useRef } from 'react';

export default function BombLine_BMS (){
    const arrVals = [], info = [];
//------------------------------Estableciendo las variables de trabajo-----------------------------------------
    // Variable de estado para la obtencion de registros
    const [metadata, setMetadata] = useState([1]);
    // Establecer las variables de las fechas
    const [fechIni, setFechIni] = useState(Date.now());
    const [fechFin, setFechFin] = useState(Date.now());
    // Establecer la variable de busqueda de datos (el filtro que se usara con la lista desplegable)
    const [tipInfoBus, setTipInfoBus] = useState("/niagaratest/L3$20$2d$20L1");
    // Los registros suelen estar desde el 15 de marzo hasta el 14 de julio
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
            (`${info.HISTORY_ID}`.includes(tipInfoBus.split(";")[0])) ? regsBusqueda.push(
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
//-------------------------Preparacion de las opciones de configuracion para la grafica------------------------
    const dataSeries = [
        {
            name: `Registros ${tipInfoBus.split(";")[1]}`,
            data: info
        }
    ];

    const options = {
        chart: {
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
            text: 'Informacion no disponible, cargando...'
        }
    };
//---Ejemplos de mapeo inicial con el arreglo de valores traidos con axios y creacion de arreglo de datos para la grafica---
    /*const info = metadata.map((reg, index) => (
        (index < 10) ? [new Date(`${reg.TIMESTAMP}`.substring(0, `${reg.TIMESTAMP}`.length - 3) * 1000), parseFloat(`${reg.VALUE}`).toFixed(2)] : 0
    ));*/

    // Pasando todos los valores
    /*const info = metadata.map((reg) => (
        [new Date(`${reg.TIMESTAMP}`.substring(0, `${reg.TIMESTAMP}`.length - 3) * 1000), parseFloat(`${reg.VALUE}`).toFixed(2)]
    ));*/
//-------------------------------------------------------------------------------------------------------------
//------------------Obtencion del valor de filtro de datos seleccionado por parte del usuario------------------
    const solFilBus = (filBus) => {
        setTipInfoBus(filBus);
    }

    /* Explicacion rapida para pasar valores entre componentes react (hijo a padre)
        Primero se crea una funcion vacia en el componente padre y una variable de estado (useState) vacia o con un valor por defecto.
        La funcion puede ser como la funcion flecha previa a esta explicacion o como el siguiente ejemplo:
            const [datos, estableceDatos] = useState('');
            const hijoAPadre = () => {
            
            }
        Luego se pasa esta funcion como propiedad a la invocacion al componente hijo como esta en SelFilBus debajo. 
            <Hijo hijoAPadre={hijoAPadre}/>
        Nota: La propiedad puede tener el nombre que sea, para fines practicos en esta ocasion se dejo el nombre de la funcion.
            <SelFilBus solFilBus={solFilBus}/>
        Despues en el componente hijo se acepta la llamada a la funcion como propiedad (parametro si se usa function), como es para este caso
            function menuDropdown({ solFilBus }) {
                ...
            }
        Y dentro del hijo se crea algun elemento que genere un evento donde se pueda invocar la funcion del componente padre; para este caso
        se hicieron botones de la lista desplegable
            <DropdownItem onClick={()=>solFilBus("/niagaratest/Engine$20Battery")}>Bateria</DropdownItem>
        Donde en el evento onClick, se invoca una arrowFunction para llamar al metodo solFilBus del componente padre y se "retorna" con
        el valor modificado.
        Finalmente, en la funcion vacia del componente padre se aceptan los datos procesados como parametro y se establece el estado creado,
        por ejemplo:
            const hijoAPadre = (datoshijo) => {
                estableceDatos(datoshijo);
            }
        O como quedo al final el metodo solFilBus previo a esta explicacion.
        Finalmente para ver si es efectivo este elemento, se imprime el valor del estado en el componente padre usando el estado entre llaves.
        Por ejemplo: el resultado del ejemplo teorico seria { datos }, ya que asi se nombro el useState inicial. */
//-------------------------------------------------------------------------------------------------------------
    return (
        <div>
            <div className='container border mt-3'>
                <div className='row align-items-center border pt-3 pb-3'>
                    <div className='col-md-3'>
                        <div className='row align-items-center'>
                            <div className='col-md-auto'>
                                <Search size={30} />
                            </div>
                            <div className='col-md-auto'>
                                <div className='row align-items-center mb-2'>
                                    <SelFilBus solFilBus={solFilBus}/>
                                </div>
                                <div className='row align-items-center'>
                                    <input type="text" className="form-control" value={tipInfoBus.split(";")[1]} placeholder="Usted selecciono..." readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-auto'>
                        <div className='row align-items-center'>
                            <div className='col-md-auto'>
                                <Calendar size={30} />
                                <Clock size={30} />
                            </div>
                            <div className='col-md-auto'>
                                <p>Seleccionar Fecha y Hora de Inicio:</p>
                                <Flatpickr ref={fechIniSel} options={optionsInicial} />
                                <button className='btn btn-danger' type="button" onClick={() => {
                                    if (!fechIniSel?.current?.flatpickr) return;
                                        fechIniSel.current.flatpickr.clear();
                                    }
                                }>
                                    Limpiar Seleccion
                                </button>
                            </div>
                            <div className='col-md-auto'>
                                <Calendar size={30} />
                                <Clock size={30} />
                            </div>
                            <div className='col-md-auto'>
                                <p>Seleccionar Fecha y Hora de Fin:</p>
                                <Flatpickr ref={fechFinSel} options={optionsFinal} />
                                <button className='btn btn-danger' type="button" onClick={() => {
                                    if (!fechFinSel?.current?.flatpickr) return;
                                        fechFinSel.current.flatpickr.clear();
                                    }
                                }>
                                    Limpiar Seleccion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row align-items-center border pt-3 pb-3'>
                    <Chart options={options} series={dataSeries} type="line" />
                </div>
            </div>
        </div>
    );
}