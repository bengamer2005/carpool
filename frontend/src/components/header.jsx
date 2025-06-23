import React, { useEffect, useState } from "react"
import logo from "../img/GrupoGPBlanco.png"

const Header = () => {
    const [user, setUser] = useState("...")

    useEffect(() => {
        fetch("http://localhost:3000/user")
        .then((res) => res.json())
        .then((data) => setUser(data.username))
        .catch(() => setUser("GGP\\Invitado"))
    }, [])

    return (
        <>
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
        </>
    )
}

export default Header