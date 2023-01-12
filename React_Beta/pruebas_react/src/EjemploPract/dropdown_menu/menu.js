/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";

export default function menuDropdown({ solFilBus }) {
    const [dropdown, setDropdown] = useState(false);

    // Metodo para abrir o cerrar la lista desplegable, segun el estado en el que este
    const abrirCerrarMenu = () => { setDropdown(!dropdown); }

    return (
        <div className="menuDesple">
            <Dropdown isOpen={dropdown} toggle={abrirCerrarMenu}>
                <DropdownToggle caret>
                    Seleccione la categoria <br />de informacion...
                </DropdownToggle>
                <DropdownMenu>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/Engine$20Battery;Bateria")}>Bateria</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/Fuel$20Level;Combustible")}>Combustible</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/L3$20$2d$20L1;Linea de Energia 1")}>Linea de Energia 1</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/L1$20$2d$20N;Linea de Energia 2")}>Linea de Energia 2</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/L1$20$2d$20L2;Linea de Energia 3")}>Linea de Energia 3</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/L2$20$2d$20L3;Linea de Energia 4")}>Linea de Energia 4</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/L3$20$2dN;Linea de Energia 5")}>Linea de Energia 5</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/mmH2O$20Contra$20Incendio1;Cantidad de Incendios")}>Cantidad de Incendios</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/mmH2O$20Pluvial1;Nivel de Drenaje")}>Nivel de Drenaje</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/mmH2O$20Potable1;Nivel de Agua")}>Nivel de Agua</DropdownItem>
                    <DropdownItem onClick={()=>solFilBus("/niagaratest/Number$20of$20Starts;Nivel de Piso")}>Nivel de Piso</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}

/* 
    BATERÍA
        /niagaratest/Engine$20Battery
    COMBUSTIBLE
        /niagaratest/Fuel$20Level
    LÍNEA DE ENERGÍA
        /niagaratest/L3$20$2d$20L1
        /niagaratest/L1$20$2d$20N
        /niagaratest/L1$20$2d$20L2
        /niagaratest/L2$20$2d$20L3
        /niagaratest/L3$20$2dN
    INCENDIOS
        /niagaratest/mmH2O$20Contra$20Incendio1
    DRENAJE
        /niagaratest/mmH2O$20Pluvial1
    AGUA
        /niagaratest/mmH2O$20Potable1
    PISO
        /niagaratest/Number$20of$20Starts
*/