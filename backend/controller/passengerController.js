const DB = require("../config/connectDB")
const Users = require("../model/usersModel")

// Llama a todas las rutas activas y que sean de ida
const getAllGoingRoute = async (req, res) => {
    try {
        const routes = await DB.query(`
            select
                Users.idUsers,
                Users.name,
                UserRoutes.idUserRoutes,
                UserRoutes.startingPoint,
                UserRoutes.arrivalPoint,
                UserRoutes.startTime,
                UserRoutes.arrivalTime,
                RouteWay.routeWay,
                Status.nameStatus,
                UserRoutes.routeInfo
            from Users 
            INNER JOIN UserRoutes ON UserRoutes.idUsers=Users.idUsers
            INNER JOIN Status ON Status.idStatus=UserRoutes.idStatus
            INNER JOIN RouteWay ON RouteWay.idRouteWay = UserRoutes.idRouteWay
            WHERE UserRoutes.idStatus=1 AND RouteWay.idRouteWay = 1
            `)
        
        if (routes.length === 0) {
            return res.status(404).json({ message: "No se encontraron rutas activas" })
        }

        res.status(200).json(routes)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al ejecutar la consulta SQL directa.", error})
    }
}

// Llaman a todas las rutas que esten activas y sean de regreseo
const getAllReturnRoute = async (req, res) => {
    try {
        const routes = await DB.query(`
            select
                Users.idUsers,
                Users.name,
                UserRoutes.idUserRoutes,
                UserRoutes.startingPoint,
                UserRoutes.arrivalPoint,
                UserRoutes.startTime,
                UserRoutes.arrivalTime,
                RouteWay.routeWay,
                Status.nameStatus,
                UserRoutes.routeInfo
            from Users 
            INNER JOIN UserRoutes ON UserRoutes.idUsers=Users.idUsers
            INNER JOIN Status ON Status.idStatus=UserRoutes.idStatus
            INNER JOIN RouteWay ON RouteWay.idRouteWay = UserRoutes.idRouteWay
            WHERE UserRoutes.idStatus=1 AND RouteWay.idRouteWay = 2
            `)
        
        if (routes.length === 0) {
            return res.status(404).json({ message: "No se encontraron rutas activas" })
        }

        res.status(200).json(routes)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al ejecutar la consulta SQL directa.", error})
    }
}

// cambia el estatus a 1 (DRIVER)
const changeStatus = async (req, res) => {
    try {
        const USER = process.env.USERNAME
        const user = await Users.findOne({ 
            where: { username: USER }
        })

        if(!user) {
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        user.idRole = 1
        await user.save()

        res.status(200).json({message: "Cambio de rol exitoso, ", user})
    } catch (error) {
        res.status(500).json({message: `Ocurrió un error al actualizar al user: ${error.message}`})
    }
}

module.exports = {
    getAllGoingRoute,
    getAllReturnRoute,
    changeStatus
}