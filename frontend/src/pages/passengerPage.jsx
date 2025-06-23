import { useEffect } from "react"
import { Notyf } from "notyf"
// hook
import Drivers from "../hooks/getAllDrivers"
import GetUserInfo from "../hooks/getUserInfo"
// componentes
import Header from "../components/header"
import Navbar from "../components/navbar"

const Passenger = () => {
    GetUserInfo()

    useEffect(() => {
        const notyf = new Notyf({
            position: { x: "right", y: "bottom" },
            duration: 5000,
        })

        notyf.success("Bienvenido a la pagina de pasajeros")
    }, [])

    return (
        <>
            <Header></Header>
            <Navbar></Navbar>
            <Drivers></Drivers>
        </>
    )
}

export default Passenger