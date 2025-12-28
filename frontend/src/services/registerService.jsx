// aqui creamos todos los servicios utilizados en el aprtado del registro y login
const APIs = import.meta.env.VITE_API_URL

// se hace el registro del usuario
export const Register = async ({ name, username, idRole, email, password }) => {
    try {
        const response = await fetch(`${APIs}/carpool/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, username, idRole, email, password})
        })

        const result = await response.json()

        if(!response.ok) {
            const errorMessage = result.message || "Error al registrarse"
            throw new Error(errorMessage)
        }

        return result 
    } catch (error) {
        console.error("Error en el Register, error: ", error)
        throw error
    }
}

export const Login = async ({ email, password }) => {
    try {
        const response = await fetch(`${APIs}/carpool/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        })

        const result = await response.json()

        if(!response.ok) {
            const errorMessage = result.message || "Error al logearte"
            throw new Error(errorMessage)
        }

        return result
    } catch (error) {
        console.error("Error en el login, error: ", error)
        throw error
    }
}