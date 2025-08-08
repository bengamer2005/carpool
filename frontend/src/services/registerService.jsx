// aqui creamos todos los servicios utilizados en el aprtado del registro

// se hace el registro del usuario
export const Register = async ({name, username, idRole, email}) => {
    try {
        const response = await fetch("http://localhost:3000/carpool/user/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, username, idRole, email})
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

// se busca al usuario que esta en pantalla para ver si esta registrado 
export const Search = async () => {
    try {
        const response = await fetch("http://localhost:3000/carpool/user/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        })

        if(!response.ok) {
            console.log("El user no esta registrado")
            // si no esta registrado marcamos como true para que no redirija
            return { userNotFound: true }
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error("Error en buscar al user, error: ", error)       
    }
}