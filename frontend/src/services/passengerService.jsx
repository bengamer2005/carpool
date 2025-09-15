// aqui creamos todos los servicios utilizados en el aprtado del pasajero

// llamamos a todas las rutas de ida de los conductores que esten activas
export const getGoingRoutes = async (userId) => {
    const response = await fetch(`https://carpool-backend-sldk.onrender.com/carpool/passenger/route/going/${userId}`)
    const data = await response.json()
    return data[0]
}

// llamamos a todas las rutas de regreso de los conductores que esten activas
export const getReturnRoutes = async (userId) => {
    const response = await fetch(`https://carpool-backend-sldk.onrender.com/carpool/passenger/route/return/${userId}`)
    const data = await response.json()
    return data[0]
}

// para solicitar una ruta
export const sendRequest = async ({idRoute, dayRequest, userId}) => {
    try {
        const response = await fetch(`https://carpool-backend-sldk.onrender.com/carpool/passenger/sendRequest/${idRoute}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({dayRequest, userId})
        })

        const result = await response.json()
    
        if(!response.ok) {
            // mandamos el mensaje que viene desde el backend, en caso de que no tenga mandamos uno por default
            const errorStatus = result.message || "Error al mandar una solicitud"
            
            if(response.status === 400) {
                throw new Error(errorStatus)
            } else if(response.status === 500) {
                throw new Error(errorStatus)
            } else if(response.status === 501) {
                throw new Error(errorStatus)
            }
        }
    
        return result
    } catch (error) {
        console.error("Error en el servidor al mandar una solicitud: ", error)
        throw error
    }
}

// llamo a todas las solicitudes aceptadas del pasajero
export const getAllAcceptedReq = async (userId) => {
    const response = await fetch(`https://carpool-backend-sldk.onrender.com/carpool/passenger/allRequest/accepted/${userId}`)
    const data = await response.json()
    return data
}