import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Notyf } from "notyf"
import { Search } from "../services/registerService"

const GetUserInfo = () => {
    const [username, setUsername] = useState("")
    const [idUsers, setIdUsers] = useState()
    const [userNotFound, setUserNotFound] = useState(null)

    const notyf = new Notyf({
        position: { x: "right", y: "bottom" },
        duration: 5000,
    })

    const changePage = useNavigate()

    useEffect(() => {
        // hacemos fetch a la api para saber el username del usuario
        fetch("http://localhost:3000/user")
        .then((res) => res.json())
        .then((data) => {
            setUsername(data.username)
            Search().then((res) => {
                if(res && typeof res.userNotFound === "boolean") {
                    setUserNotFound(res.userNotFound)
                    setIdUsers(res.idUsers)
                    // si esta registrado lo redirije al apartado segun su rol
                    switch(Number(res.idRole)) {
                        case 1:
                            changePage("/conductor")
                            break
                        case 2:
                            changePage("/pasajero")
                            break
                        case 3:
                            changePage("/admin")
                            break
                        default:
                            // si no esta registrado y se mueve a un apartado lo regresa al main para que se registre
                            changePage("/")
                            notyf.error("Primero debes registrarte")
                            break
                    }
                } else {
                    setUserNotFound(res.userNotFound)
                }
            }).catch(() => {
                setUserNotFound(false)
            })
        })
    }, []) 

    return {
        username, userNotFound, idUsers
    }
}

export default GetUserInfo