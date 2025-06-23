const UsersDB = require("../config/connectUserDataDB")

// const sequelize = require("sequelize")
const getAllUsers = async (req, res) => {
    try {
        const USER = process.env.USERNAME
        P_ActyDirectory = USER
        
        const results = await UsersDB.query(`
            SELECT Nombre, ApPaterno, ApMaterno, Correo
            FROM tblGGP_Empleados AS Empleado
            WHERE 
                CASE 
                    WHEN CHARINDEX('@', Empleado.Correo) > 0 
                    THEN LEFT(Empleado.Correo, CHARINDEX('@', Empleado.Correo) - 1) 
                    ELSE '' 
                END = :P_ActyDirectory
        `, {
            replacements: { P_ActyDirectory },
        })

        if (results.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        
        res.status(200).json(results)
    } catch (error) {
        console.error("Error en consulta SQL directa:", error)
        res.status(500).json({
            message: "Ocurrió un error al ejecutar la consulta SQL directa.",
            error
        })
    }
}

module.exports = {
    getAllUsers
}