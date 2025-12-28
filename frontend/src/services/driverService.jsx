// aqui creamos todos los servicios utilizados en el aprtado del conductor
const APIs = import.meta.env.VITE_API_URL

// llamamos todas las rutas del codnuctor
export const UserRoutes = async (idUsers) => {
    const response = await fetch(`${APIs}/carpool/driver/getUserRoute/${idUsers}`)
    const data = await response.json()
    return data[0]
}

// cambiamos el estatus de la ruta a activa/inactiva
export const ChangeStatusRoute = async (idUser) => {
    try {
        const response = await fetch (`${APIs}/carpool/driver/route/active/${idUser}`, {
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
        const response = await fetch (`${APIs}/carpool/driver/allRoute/disable/${idUsers}`, {
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
export const RegisterRoute = async ({ data, idUsers }) => {
    try {
        const response = await fetch(`${APIs}/carpool/driver/createRoute/${idUsers}`, {
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
export const updateRequestStatus = async (data) => {
    try {
        const response = await fetch(`${APIs}/carpool/driver/request/actions`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if(!response.ok) {
            throw new Error(`Ocurrio un error al tratar de aceptar/rechazar las solicitudes`)
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
        const response = await fetch(`${APIs}/carpool/driver/request/getAll/${idUsers}`)

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
    const response = await fetch(`${APIs}/carpool/driver/rides/getAll/${idUsers}`)
    const result = await response.json()

    return result
}

// elimina logicamente una ruta
export const setNotVisibleRoute = async (idUserRoute) => {
    try {
        const response = await fetch(`${APIs}/carpool/driver/route/delete/${idUserRoute}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if(!response.ok) {
            throw new Error(`Ocurrio un error al tratar de eliminar tu ruta`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error al tratar de eliminar una ruta, error: ", error)
    }
}