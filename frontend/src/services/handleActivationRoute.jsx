import React from "react"

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

export const DisableAllRoutes = async () => {
    try {
        const response = await fetch ("http://localhost:3000/carpool/driver/allRoute/disable", {
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