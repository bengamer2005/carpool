import React from "react"

const RegisterRoute = async  (data) => {
    try {
        const response = await fetch("http://localhost:3000/carpool/driver/createRoute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })

        if(!response.ok) {
            throw new Error("Error en el servidor al registrar la ruta")
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error en el registro de la ruta: ", error)
        throw error
    }
}

export default RegisterRoute