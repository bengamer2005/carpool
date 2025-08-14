// aqui creamos todos los servicios utilizados en el aprtado del conductor

// llamamos todas las rutas del codnuctor
export const UserRoutes = async (idUsers) => {
    const response = await fetch(`http://localhost:3000/carpool/driver/getUserRoute/${idUsers}`)
    const data = await response.json()
    return data[0]
}

// cambiamos el estatus de la ruta a activa/inactiva
export const ChangeStatusRoute = async (idUser) => {
    try {
        const response = await fetch (`http://localhost:3000/carpool/driver/route/active/${idUser}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(!response.ok) {
            alert("Error al cambiar el estatus de la ruta")
            return new Error
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error al cambiar el estatus de la ruta, error: ", error)
    }
}

// deshabilitamos todas las rutas del conductor
export const DisableAllRoutes = async (idUsers) => {
    try {
        const response = await fetch (`http://localhost:3000/carpool/driver/allRoute/disable/${idUsers}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(!response.ok) {
            alert("Error al deshabilitar todas las rutas")
            return new Error
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error al deshabilitar todas las rutas (CARFULL), error: ", error)
    }
}

// agregamos una ruta nueva
export const RegisterRoute = async (data, idUsers) => {
    try {
        const response = await fetch(`http://localhost:3000/carpool/driver/createRoute/${idUsers}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        const result = await response.json()
        
        if(!response.ok) {
            const errorStatus = result.message || "Error al crear la ruta"
            
            if(response.status === 400) {
                throw new Error(errorStatus)
            } else if(response.status === 501) {
                throw new Error(errorStatus)
            } else {
                throw new Error("Error en el servidor al registrar la ruta")
            }
        }

        return result
    } catch (error) {
        console.error("Error en el registro de la ruta: ", error)
        throw error
    }
}

// llamado para aceptar / rechazar una solicitud
export const updateRequestStatus = async (idRequest, action) => {
    try {        
        // en caso de que se mande una peticion que no sea aceptada o rechazada lanza un nuevo error
        if (!["accepted", "rejected"].includes(action)) {
            throw new Error("Acción inválida")
        }

        const response = await fetch(`http://localhost:3000/carpool/driver/request/${action}/${idRequest}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })

        // llamamos a la solicitud para sacar si esta aceptada o rechazada
        const request = await fetch(`http://localhost:3000/carpool/passenger/request/${idRequest}`)
        const requestData = await request.json()

        // sacamos es estatus de la solicitud
        const requestStatus = requestData.idStatusReq

        // lanzamos error si esta aceptada o rechazada
        if(!response.ok) {
            throw new Error(`No se puede ${action === "accepted" ? "aceptar" : "rechazar"} la solicitud ya que esta ${requestStatus == 2 ? "aceptada" : "rechazada"}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error al aceptar/rechazar la solicitud: ", error)
        throw error
    }
}

// llamamos a todas las solicitudes del conductor
export const AllDriverRequest = async (idUsers) => {
    try {
        const response = await fetch(`http://localhost:3000/carpool/driver/request/getAll/${idUsers}`)

        if(!response) {
            throw new Error("Error al llamar las solicitudes del conductor")
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error al llamar a todas las solicitudes, error: ", error)
    }
}

// llama a todos los viajes del conductor
export const getAllRides = async (idUsers) => {
    const response = await fetch(`http://localhost:3000/carpool/driver/rides/getAll/${idUsers}`)
    const data = await response.json()

    // los grupamos por dia
    function groupForDay(rides) {
        const groups = {
            lunes: [],
            martes: [],
            miércoles: [],
            jueves: [],
            viernes: []
        }

        rides.forEach(ride => {
            const day = ride.diaSolicitado.toLowerCase()

            if(groups[day]) {
                groups[day].push(ride)
            }
        })

        return groups
    }

    return groupForDay(data)
}