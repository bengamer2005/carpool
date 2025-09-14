import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import Swal from 'sweetalert2'
import { Notyf } from "notyf"
import { motion, AnimatePresence } from "framer-motion"
// componentes
import Header from "../components/header"
// servicios
import { Register, Login } from "../services/registerService"

const notyf = new Notyf({
    position: { x: "right", y: "bottom" },
    duration: 5000
})

const RegisterPage = () => {
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [idRole, setIdRole] = useState("")
    const [password, setPassword] = useState("")

    // manejamos el estado de los formularios
    const [formType, setFormType] = useState("register")
    
    const toogleFormType = () => {
        setFormType((prev) => (prev === "register" ? "login" : "register"))
    }

    const changePage = useNavigate()

    // maneja la logica del registro
    const handleRegister = async (event) => {
        event.preventDefault()

        // si faltan campos le notificamos al usuario
        if(!name || !username || !email || !idRole || !password) {
            notyf.error("Faltan campos por llenar")
            return
        }

        // adjuntamos la data
        const data = {
            name, username, idRole, email, password
        }

        const userData = {
            name, username, idRole, email
        }

        try {
            // llamamos al servicio 
            const result = await Register(data)
            
            if(result) {
                // guardamos los datos en localStorage
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.userInfo))  

                // le notificamos al usuario el registro exitoso
                const swalResult = await Swal.fire({
                    title: "¡Registro exitoso!",
                    html: `BIENVENIDO a <strong>CARPOOL</strong>, has seleccionado el rol de: <b>${Number(idRole) === 1 ? "Conductor" : "Pasajero"}</b><br><br>Puedes cambiar de rol desde la barra de navegación.`,
                    icon: "success",
                    confirmButtonText: "Aceptar"
                })

                // lo redirigimos a la page segun el rol seleccioando
                if(swalResult.isConfirmed) {
                    switch(Number(idRole)) {
                        case 1: 
                            changePage("/conductor")
                            break
                        case 2: 
                            changePage("/pasajero")
                            break
                    }
                }
            }

        } catch (error) {
            notyf.error(error.message || "Ocurrió al registrarse")
        }
    }

    // maneja la logica del login
    const handleLogin = async (event) => {
        event.preventDefault()

        // si faltan campos le notificamos al usuario
        if(!email || !password) {
            notyf.error("Faltan campos por llenar")
            return
        }

        // adjuntamos la data
        const data = {
            email, password
        }

        try {
            // llamamos al servicio
            const result = await Login(data)

            if(result) {
                // le notificamos al usuario el registro exitoso
                notyf.success(`Bienvenido de nuevo ${result.user.username}`)

                // guardamos los datos en localStorage
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user))

                // lo redirigimos a la page segun el rol que tenia
                switch(Number(result.user.idRole)) {
                    case 1: 
                        changePage("/conductor")
                        break
                    case 2: 
                        changePage("/pasajero")
                        break
                }
            }

        } catch (error) {
            notyf.error(error.message || "Ocurrió al registrarse")
        }
    }
    return (
        <>
            <Header/>
            
            <AnimatePresence mode="wait">
                {formType === "register" ? (
                    <motion.div 
                        key="register"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}>

                        <h2 className="title">REGISTRARSE</h2>

                        <div className="contenedor-form-register">
                            <form className="form" onSubmit={handleRegister}>
                                <span className="subtitle">Si aun no estas registrado, favor de llenar los siguientes datos:</span>

                                <div className="form-container">
                                    <input type="text" className="field" placeholder="nombre: " onChange={(event) => setName(event.target.value)}/>
                                    <input type="text" className="field" placeholder="apodo: " onChange={(event) => setUsername(event.target.value)}/>
                                    <input type="email" className="field" placeholder="correo: " onChange={(event) => setEmail(event.target.value)}/>
                                    <input type="password" className="field" placeholder="contraseña: " onChange={(event) => setPassword(event.target.value)}/>

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
                        </div>
                    
                        <div className="center">Ya tienes cuenta?{' '}
                            <div className="button-padding">       
                                <button className="button-change-route" onClick={toogleFormType}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    {" "}INICIA SESION
                                </button>
                            </div>
                        </div>

                    </motion.div>
                ) : (
                    <motion.div 
                        key="login"
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -60 }}
                        transition={{ duration: 0.4 }}>
                        
                        <h2 className="title">INICIA SESION</h2>

                        <div className="contenedor-form-register">
                            <form className="form" onSubmit={handleLogin}>
                                <span className="subtitle">Favor de llenar los siguientes datos para iniciar sesion:</span>

                                <div className="form-container">
                                    <input type="email" className="field" placeholder="correo: " onChange={(event) => setEmail(event.target.value)}/>
                                    <input type="password" className="field" placeholder="contraseña: " onChange={(event) => setPassword(event.target.value)}/>
                                </div>

                                <button type="submit" className="submit">
                                    INICIA SESION
                                </button>
                            </form>
                        </div>
                    
                        <div className="center">¿Aun no tienes cuenta?{' '}
                            <div className="button-padding">       
                                <button className="button-change-route" onClick={toogleFormType}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5m14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5"/>
                                    </svg>
                                    {" "}REGISTRATE
                                </button>
                            </div>
                        </div>
                        
                    </motion.div>
                ) }
            </AnimatePresence>
        </>
    )
}

export default RegisterPage
