import React, { useEffect, useState } from "react"
// componentes
import logo from "../img/GrupoGPBlanco.png"

const Header = () => {
    const [user, setUser] = useState("...")

    // se hace un fetch para saber el username del user
    useEffect(() => {
        fetch("http://localhost:3000/user")
        .then((res) => res.json())
        .then((data) => setUser(data.username))
        .catch(() => setUser("GGP\\Invitado"))
    }, [])

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
                    Hola, {user}!
                </div>
            </header>
        </div>
    )
}

export default Header