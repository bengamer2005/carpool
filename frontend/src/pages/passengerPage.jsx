import { useEffect } from "react"
import { Notyf } from "notyf"
// hook
import Drivers from "../hooks/getAllDrivers"
import GetUserInfo from "../hooks/getUserInfo"
import AcceptedReq from "../hooks/getAllAcceptedReq"
// componentes
import Header from "../components/header"
import Navbar from "../components/navbar"
// servicios
import useSSEListen from "../services/sseService"

const Passenger = () => {
    const userId = localStorage.getItem("userId")
    useSSEListen(userId)
    
    // se obtiene la info de user para ver si es de este rol si no, lo cambiams sal rol definido
    GetUserInfo()

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