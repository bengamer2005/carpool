import React, { useEffect, useState } from "react"
// componentes
import logo from "../img/GrupoGPBlanco.png"

const Header = () => {
    // se obtiene la info del user guardada en localStorage
    const userData = JSON.parse(localStorage.getItem("user"))

    return (
        <div className="header-wrapper">
            <header className="header">
                <div className="header-left">
                    <img src={logo} alt="Grupo GP Logo" className="logo" />
                </div>

                <div className="header-center">
                    CARPOOL
                </div>
                
                <div className="header-right">
                    Hola, {userData.username}!
                </div>
            </header>
        </div>
    )
}

export default Header