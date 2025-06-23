import { useNavigate, useLocation } from "react-router"
import Swal from "sweetalert2"

const Navbar = () => {
    const changePage = useNavigate()
    const page = useLocation()

    const pageDriver = page.pathname === "/conductor"
    const pagePassenger = page.pathname === "/pasajero"

    const handleRole = async (role, rolePage) => {
        const changeRole = await Swal.fire({
            title: "CAMBIO DE ROL",
            text: `¿Quieres cambiar al rol de ${role === "driver" ? "PASAJERO" : "CONDUCTOR"}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "si",
            cancelButtonText: "cancelar"
        })

        if(!changeRole.isConfirmed) {
            return null
        }

        try {
            const response = await fetch(`http://localhost:3000/carpool/${role}/changeStatus`, {
                method: "PUT",
                headers: {
                    "Content-type" : "application/json"
                }
            })

            if(!response.ok) {
                console.error("Error al cambiar el rol")
            }

            changePage(rolePage)
        } catch (error) {
            alert("Ocurrio un error en handleRole, ", error)
        }
    }

    return (
        <nav>
            <div className={`nav-section ${pageDriver && "active"}`}>
                <button className="nav-bar" onClick={() => handleRole("passenger", "/conductor")}>CONDUCTOR</button>
            </div>

            <div className={`nav-section ${pagePassenger && "active"}`}>
                <button className="nav-bar" onClick={() => handleRole("driver", "/pasajero")}>PASAJERO</button>
            </div>
        </nav>
    )
}

export default Navbar