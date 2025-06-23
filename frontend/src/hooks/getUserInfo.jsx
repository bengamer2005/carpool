import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Notyf } from "notyf"
import Search from "../services/handleSearchUser"

const GetUserInfo = () => {
    const [username, setUsername] = useState("")
    const [idUsers, setIdUsers] = useState()
    const [userNotFound, setUserNotFound] = useState(null)

    const changePage = useNavigate()

    useEffect(() => {
        fetch("http://localhost:3000/user")
        .then((res) => res.json())
        .then((data) => {
            setUsername(data.username)
            Search().then((res) => {
                if(res && typeof res.userNotFound === "boolean") {
                    setUserNotFound(res.userNotFound)
                    setIdUsers(res.idUsers)
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
                            changePage("/")
                            const notyf = new Notyf({
                                position: { x: "right", y: "bottom" },
                                duration: 5000,
                            })

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