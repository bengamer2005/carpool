import { useEffect } from "react"
import { Notyf } from "notyf"
// hook
import Drivers from "../hooks/getAllDrivers"
import AcceptedReq from "../hooks/getAllAcceptedReq"
// componentes
import Header from "../components/header"
import Navbar from "../components/navbar"
// servicios
import useSSEListen from "../services/sseService"

const Passenger = () => {
    const userId = localStorage.getItem("userId")
    useSSEListen(userId)

    // se manda una notificacion con Notyf al entrar al apartado
    useEffect(() => {
        const notyf = new Notyf({
            position: { x: "right", y: "bottom" },
            duration: 5000,
        })

        notyf.success("Bienvenido al aparrtado de pasajeros")
    }, [])

    return (
        <>
            <Header></Header>
            <Navbar/>
            <Drivers></Drivers>
            <AcceptedReq></AcceptedReq>
        </>
    )
}

export default Passenger