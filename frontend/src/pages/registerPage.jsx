import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Swal from 'sweetalert2'
// hook
import GetUserInfo from "../hooks/getUserInfo"
// componentes
import Header from "../components/header"
// servicios
import Register from "../services/handleRegisterUser"

const RegisterPage = () => {
    const { username, userNotFound } = GetUserInfo()
    const [nameData, setNameData] = useState([])
    const [name, setName] = useState("")
    const [idRole, setIdRole] = useState("")

    const changePage = useNavigate()

    // OBTIENE EL NOMBRE Y LO JUNTA
    useEffect(() => {
    fetch("http://localhost:3000/carpool/userData/users")
    .then((res) => res.json())
    .then((data) => {
        const userData = data[0]
        setNameData(userData)

        if (userData.length > 0) {
            const { Nombre, ApPaterno, ApMaterno } = userData[0]
            setName(`${Nombre} ${ApPaterno} ${ApMaterno}`)
        }
    })
    }, [])

    // MANEJA LA LOGICA DEL REGISTER
    const handleRegister = async (event) => {
        event.preventDefault()

        if (!idRole) {
            return alert("Te falta seleccionar el rol")
        }
        
        const result = await Register({ name, username,  idRole})

        if (result) {
            let role = ""

            switch (Number(idRole)) {
                case 1:
                    role = "conductor"
                    break
                case 2:
                    role = "pasajero"
                    break
                case 3:
                    role = "admin"
                    break
            }

            const swalResult = await Swal.fire({
                title: "¡Registro exitoso!",
                html: `BIENVENIDO a <strong>CARPOOL</strong>, has seleccionado el rol de: <b>${role}</b><br><br>Puedes cambiar de rol desde la barra de navegación.`,
                icon: "success",
                confirmButtonText: "Aceptar"
            })

            if(swalResult.isConfirmed) {
                switch (Number(idRole)) {
                    case 1:
                        changePage("/conductor")
                        break
                    case 2:
                        changePage("/pasajero")
                        break
                    case 3:
                        changePage("/admin")
                        break
                }
            }
        }
    }

    return (
        <>
            <Header/>
            <h2 className="title">REGISTRARSE</h2>

            <main>
                {userNotFound === true && (
                    <form className="form" onSubmit={handleRegister}>
                        <span className="subtitle">Si aun no estas registrado, favor de llenar los siguientes datos:</span>

                        <div className="form-container">
                            <p className="user">{name}</p>
                            <input type="hidden" value={name}/>
                            <input type="hidden" value={username}/>
                            <select className="field" value={idRole} onChange={(event) => setIdRole(event.target.value)}>
                                <option>-- SELECCIONA UN ROL --</option>
                                <option value="1">CONDUCTOR</option>
                                <option value="2">PASAJERO</option>
                            </select>
                        </div>

                        <button type="submit" className="submit">
                            REGISTRAR
                        </button>
                    </form>
                )}
            </main>
        </>
    )
}

export default RegisterPage
