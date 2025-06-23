import React from "react"

const Register = async ({name, username, idRole}) => {
    try {
        const response = await fetch("http://localhost:3000/carpool/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, username, idRole})
        })

        if(!response.ok) {
            alert("No se pudo registrar")
            return null
        }

        const result = await response.json()
        return result 
    } catch (error) {
        console.error("Error en el Register, error: ", error)
    }
}

export default Register