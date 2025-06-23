import React from "react"

const Search = async () => {
    try {
        const response = await fetch("http://localhost:3000/carpool/user/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if(!response.ok) {
            console.log("El user no esta registrado")
            return { userNotFound: true }
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error en buscar al user, error: ", error)       
    }
}

export default Search