import { useEffect } from "react"
import { Notyf } from "notyf"
// hook
import Drivers from "../hooks/getAllDrivers"
import AcceptedReq from "../hooks/getAllAcceptedReq"
// componentes
import Header from "../components/header"
import Navbar from "../components/navbar"
import Footer from "../components/footer"
// servicios
import useSSEListen from "../services/sseService"

const Passenger = () => {
    const userId = JSON.parse(localStorage.getItem("user"))
    useSSEListen(userId.idUsers)

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
            <Footer/>
        </>
    )
}

export default Passenger