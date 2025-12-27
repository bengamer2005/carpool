const DB = require("../config/connectDB")
//modelos
const Users = require("../model/usersModel")
const UserRoutes = require("../model/userRoutesModel.js")
const Request = require("../model/requestModel.js")
// servicios
const sendEmail = require("../service/sendEmailService")
const { sendEventToUser } = require("../service/sseService")
// templates
const emailTemplates = require("../emails/emailTemplates.js")

// controladores
// Llama a todas las rutas activas y que sean de ida
const getAllGoingRoute = async (req, res) => {
    try {
        // conseguimos la info del usuario actual
        const userId = req.params.id
        const user = await Users.findOne({ 
            where: { idUsers: userId }
        })

        // le hacemos una consulta a todas las rutas de los usuarios que sean de ida
        const routes = await DB.query(`
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
                UserRoutes.routeInfo,
                StatusReq.nameStatus AS requestStatus,
                R.dateRegister as dateReq
            FROM Users 
            INNER JOIN UserRoutes ON UserRoutes.idUsers = Users.idUsers
            INNER JOIN Status ON Status.idStatus = UserRoutes.idStatus
            INNER JOIN RouteWay ON RouteWay.idRouteWay = UserRoutes.idRouteWay
            LEFT JOIN (
                SELECT *
                FROM Requests
                WHERE idUserReq = :idUser
                AND CAST(dayRequest AS DATE) = CAST(GETDATE() AS DATE)
            ) AS R ON R.idRoute = UserRoutes.idUserRoutes
            LEFT JOIN StatusReq ON StatusReq.idStatusReq = R.idStatusReq
            WHERE UserRoutes.idStatus = 1
            AND RouteWay.idRouteWay = 1
            AND UserRoutes.active = 1
        `, {
            replacements: { idUser: user.idUsers }
        })
        
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
        // conseguimos la info del usuario actual
        const userId = req.params.id
        const user = await Users.findOne({ 
            where: { idUsers: userId }
        })

        // le hacemos una consulta a todas las rutas de los usuarios que sean de ida
        const routes = await DB.query(`
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
                UserRoutes.routeInfo,
                StatusReq.nameStatus AS requestStatus,
                R.dateRegister as dateReq
            FROM Users 
            INNER JOIN UserRoutes ON UserRoutes.idUsers = Users.idUsers
            INNER JOIN Status ON Status.idStatus = UserRoutes.idStatus
            INNER JOIN RouteWay ON RouteWay.idRouteWay = UserRoutes.idRouteWay
            LEFT JOIN (
                SELECT *
                FROM Requests
                WHERE idUserReq = :idUser
                AND CAST(dateRegister AS DATE) = CAST(GETDATE() AS DATE)
            ) AS R ON R.idRoute = UserRoutes.idUserRoutes
            LEFT JOIN StatusReq ON StatusReq.idStatusReq = R.idStatusReq
            WHERE UserRoutes.idStatus = 1
            AND RouteWay.idRouteWay = 2
            AND UserRoutes.active = 1
        `, {
            replacements: { idUser: user.idUsers }
        })
        
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
        // conseguimos la info del usuario actual
        const userId = req.params.id
        const user = await Users.findOne({ 
            where: { idUsers: userId }
        })

        if(!user) {
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        // le cambiamos el role a conductor al usuario
        user.idRole = 1
        await user.save()

        res.status(200).json({message: "Cambio de rol exitoso, ", user})
    } catch (error) {
        res.status(500).json({message: `Ocurrió un error al actualizar al user: ${error.message}`})
    }
}

// manda la solicitud (correo)
const sendRequest = async (req, res) => {

    // conseguimos el id de la ruta solicitada
    const id = Number(req.params.id)

    try {
        // conseguimos la info de la ruta solicitada
        const routeRequested = await UserRoutes.findByPk(id)
        
        const userRoute = routeRequested.idUsers
        const user = await Users.findOne({
            where: { idUsers: userRoute}
        })

        const email = user.email

        // validamos que no este eliminada la ruta
        if(routeRequested.active !== 1) {
            return res.status(400).json({message: "No se pudo solicitar ya que la ruta fue eliminada"})
        }

        // validamos que no se pueda solicitar si esta inactiva
        if(routeRequested.idStatus === 2) {
            return res.status(501).json({message: "No se pudo solicitar la ruta ya que esta inactiva"})
        }
        
        // conseguimos la info del solicitador
        const { userId } = req.body
        const userReq = await Users.findOne({ 
            where: { idUsers: userId }
        })

        // validamos que no sea el dueño de la ruta quien la solicito
        // if(userReq.idUsers === user.idUsers) {
        //     return res.status(403).json({message: "No se puede solicitar una ruta tuya"})
        // }

        // guardamos todos los datos de la solicitud para luego hacer el post
        const idUserReq = userReq.idUsers
        const idRoute = id
        const idStatusReq = 1
        const { dayRequest } = req.body

        // ordenamos las fechas
        dayRequest.sort((a, b) => new Date(a) - new Date(b))

        // consultamos que no haya una solicitud del userReq que sea en el mismo dia que esta solicitando
        const reqDates = await DB.query(`
            SELECT dayRequest, idRoute 
            FROM Requests 
            WHERE dayRequest IN (:days) AND idRoute = :idRoute AND idUserReq = :userReq
            `, {
                replacements: { days: dayRequest, idRoute: idRoute, userReq: userReq.idUsers},
                type: DB.QueryTypes.SELECT
            })
        
        if(reqDates.length > 0) {
            return res.status(400).json({message: "Ya has solicitado esta ruta en el mismo dia"})
        }
        
        // hacemos el post de las solicitudes
        for(const date of dayRequest) {
            await Request.create({ idUserReq, idRoute, idStatusReq, dayRequest: date })
        }
        
        // enviamos evento sse
        sendEventToUser(String(user.idUsers), { 
            type: "new-request", 
            timestamp: Date.now(),
            userId: String(user.idUsers)
        })

        // obtenemos toda la info de la ruta, pasajero y solicitud
        const htmlSolicitud = emailTemplates.solicitudRuta(userReq, routeRequested, dayRequest)
        
        // se manda el correo
        await sendEmail(email, "Solicitud de ruta", htmlSolicitud)
            .catch(err => console.error("Error al enviar correo rechazado:", err))
        
        res.status(200).json({message: "Solicitud / correo mandado de forma exitosa"})
    } catch (error) {
        console.log("Error", error.message)
        res.status(500).json({message: `Ocurrió un error al mandar la solicitud de ruta al user: ${error.message}`})
    }
}

// llama a una solicitud
const getRequest = async (req, res) => {
    try {
        // se consigue la info de la solicitud especifica
        const request = await Request.findByPk(req.params.id)

        if(!request) {
            return res.status(404).json({message: "No se encontro la solicitud"})
        }

        res.status(200).json(request)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al llamar a una solicitud", error})
    }
}

// llama a las solicitudes aceptadas
const getAcceptedRequest = async (req, res) => {
    try {
        // conseguimos la info del usuario actual
        const userId = req.params.id
        const user = await Users.findOne({ 
            where: { idUsers: userId }
        })

        // hacemos una consulta para obtener toda la informacion requerida de la solicitud aceptada
        const getAcceptedReq = await DB.query(`
            SET LANGUAGE SPANISH
            SELECT 
                Req.idRequest as idReq,
                FORMAT(Req.dayRequest, 'dddd dd "de" MMMM "de" yyyy', 'es-ES') as dayReq,
                CONVERT(varchar, Req.dayRequest, 23) as fechaViaje,
                USers.name as nameDriver,
                Users.email as emailDriver,
                Routes.startingPoint as start,
                Routes.arrivalPoint as arrival,
                Routes.startTime,
                Routes.arrivalTime,
                StatusReq.nameStatus,
                RouteWay.routeWay,
                Req.confirmation
            FROM Requests Req
            INNER JOIN UserRoutes Routes ON Routes.idUserRoutes = Req.idRoute
            INNER JOIN Users ON Users.idUsers = Routes.idUsers
            INNER JOIN Status ON Status.idStatus = Routes.idStatus
            LEFT JOIN StatusReq ON StatusReq.idStatusReq = Req.idStatusReq
            LEFT JOIN RouteWay ON RouteWay.idRouteWay = Routes.idRouteWay
            WHERE Req.idUserReq = :idUsers 
                AND Req.idStatusReq = 2 
                AND NOT EXISTS (
                    SELECT 1
                    FROM Requests r
                    INNER JOIN UserRoutes ur on ur.idUserRoutes = r.idRoute
                    WHERE r.idUserReq = Req.idUserReq
                        AND CONVERT(date, r.dayRequest) = CONVERT(date, Req.dayRequest)
                        AND ur.idRouteWay = Routes.idRouteWay
                        AND r.confirmation = 1
                        AND Req.confirmation = 0
                )
        `, {
            replacements: { idUsers: user.idUsers },
            type: DB.QueryTypes.SELECT
        })

        if(!getAcceptedReq) {
            return res.status(404).json({message: "No se encontro ninguna solicitud aceptada"})
        }

        res.status(200).json(getAcceptedReq)
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al llamar a las solicitudes aceptadas: ", error})
    }
}

// marca las rutas que el usuario marco como viajes confirmados
const confirmRide = async (req, res) => {
    try {
        const { rides } = req.body

        // hacemos el update de todas los viajes que confirmo el usuario
        for (const cr of rides) {
            // hacemos el update de que confirmo
            await Request.update({
                confirmation: 1
            }, {
                where: { idRequest: cr }
            })
        }

        res.status(200).json(rides)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al marcar como completadas las rutas: ", error})
    }
}

module.exports = {
    getAllGoingRoute,
    getAllReturnRoute,
    changeStatus,
    sendRequest,
    getRequest,
    getAcceptedRequest,
    confirmRide
}