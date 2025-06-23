const Users = require("../model/usersModel")
const UserRoutes = require("../model/userRoutesModel.js")
const DB = require("../config/connectDB")

// cambia el estatus a 2 (PASSENGER)
const changeStatus = async (req, res) => {
    try {
        const USER = process.env.USERNAME
        
        const user = await Users.findOne({ 
            where: { username: USER }
        })

        if(!user) {
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        user.idRole = 2
        await user.save()

        res.status(200).json({message: "Cambio de rol exitoso, ", user})
    } catch (error) {
        res.status(500).json({message: `Ocurrió un error al actualizar al user: ${error.message}`})
    }
}

// crea una ruta
const createRoute = async (req, res) => {
    const { startingPoint, arrivalPoint, idStatus, idUsers, idRouteWay, startTime, arrivalTime, routeInfo } = req.body

    if (!startingPoint || !arrivalPoint || !idStatus || !idUsers || !idRouteWay || !startTime || !arrivalTime || !routeInfo) {
        return res.status(400).json({ message: "Faltan campos obligatorios" })
    }


    try {
        const route = await UserRoutes.create({ startingPoint, arrivalPoint, idStatus, idUsers, idRouteWay, startTime, arrivalTime, routeInfo })
        res.status(200).json(route)
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al crear una ruta: ", error})
    }
}

// llama las rutas de el usuario (activas e inactivas)
const getUserRoute = async (req, res) => {
    try {     
        const user = process.env.USERNAME
    
        const getIdUser = await Users.findOne({
            where: {username: user}
        })
    
        if (!getIdUser) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
    
        const idUser = getIdUser.idUsers

        const userRoute = await DB.query(`
            SELECT
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
            FROM Users 
            INNER JOIN UserRoutes ON UserRoutes.idUsers = Users.idUsers
            INNER JOIN Status ON Status.idStatus = UserRoutes.idStatus
            INNER JOIN RouteWay ON RouteWay.idRouteWay = UserRoutes.idRouteWay
            WHERE UserRoutes.idUsers = :idUser`, {
                replacements: {idUser}
        })

        if(userRoute.length === 0) {
            return res.status(404).json({message: "No se encontraron rutas para el usuaraio con id: ", idUser})
        }

        res.status(200).json(userRoute)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al ejecutar la consulta SQL directa", error}) 
    }
}

// desactiva todas las rutas del usuario, controlador para el CARFULL
const disableAllUserRoutes = async (req, res) => {
    try {
        const user = process.env.USERNAME
    
        const getIdUser = await Users.findOne({
            where: {username: user}
        })
    
        if (!getIdUser) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
    
        const idUser = getIdUser.idUsers

        const userRoute = await DB.query(`
            UPDATE UserRoutes 
                SET idStatus = 2
            WHERE idUsers = :idUser`, {
                replacements: {idUser}
            })

        if(userRoute.length === 0) {
            return res.status(404).json({message: "No se encontraron rutas para el usuaraio con id: ", idUser})
        }

        res.status(200).json(userRoute)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al ejecutar la consulta SQL directa", error}) 
    }
}

// cambia el estatus de la ruta a 1 o 2, dependiendo y deshabilita las demas
const changeRouteStatus = async (req, res) => {
    try {
        const route = await UserRoutes.findByPk(req.params.id)

        const idUser = route.idUsers
        const idRouteWay = route.idRouteWay

        const disableOtherRoutes = await DB.query(`
            UPDATE UserRoutes
                SET idStatus = '2'
            WHERE idUsers = :idUser AND idRouteWay = :idRouteWay`,{
                replacements: {idUser, idRouteWay}
            })

        if(route.idStatus === 1) {
            route.idStatus = 2
            await route.save()
        } else {
            route.idStatus = 1
            await route.save()
        }

        res.status(200).json({message: "Cambio de estatus exitoso: " + route + "\nOtras rutas afectadas: " + disableOtherRoutes})
    } catch (error) {
        res.status(500).json({message: `Ocurrio un error al cambiar de estatus una ruta: ${error.message}`})
    }
}

module.exports = {
    changeStatus,
    createRoute,
    getUserRoute,
    disableAllUserRoutes,
    changeRouteStatus,
    // changeRouteStatusDisable
}