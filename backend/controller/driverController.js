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
// cambia el estatus a 2 (PASSENGER)
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

        // se cambia de role al user
        user.idRole = 2
        await user.save()

        res.status(200).json({message: "Cambio de rol exitoso, ", user})
    } catch (error) {
        res.status(500).json({message: `Ocurrió un error al actualizar al user: ${error.message}`})
    }
}

// crea una ruta
const createRoute = async (req, res) => {
    // se obtiene el id del user quien crea la ruta
    const userId = req.params.id
    const getIdUser = await Users.findOne({
        where: { idUsers: userId }
    })

    if(getIdUser.length === 0) {
        return res.status(404).json({ errorCode: "USER_NO_REGISTER", message: "Usuario aun no registrado" })
    }

    const { startingPoint, arrivalPoint, idStatus, idUsers, idRouteWay, startTime, arrivalTime, routeInfo, active } = req.body
    
    // se valida que contenga todos los campos obligatorios
    if(!startingPoint || !arrivalPoint || !idStatus || !idUsers || !idRouteWay || !startTime || !arrivalTime || !routeInfo) {
        return res.status(400).json({ errorCode: "FIELDS_MISSING", message: "Faltan campos obligatorios" })
    }
    
    // valida que el tiempo de llegada no sea menor al de salida
    if(startTime > arrivalTime) {
        return res.status(400).json({ errorCode: "START_ABOVE_ARRIVAL", message: "La hora de salida no puede ser mayor a la de llegada" })
    }

    // le sumamos 3 horas al tiempo de salida
    const [hours, min] = startTime.split(":").map(Number)
    const date = new Date()

    date.setHours(hours, min, 0, 0)
    date.setHours(date.getHours() + 3)

    const limmitTime = date.toTimeString().slice(0, 5)

    // validamos que el tiempo de llegada no sea mayor a 3 horas despues de la hora de salida
    if(arrivalTime > limmitTime) {
        return res.status(400).json({ errorCode: "LIMIT_TIME_EXCEED", message: "La hora de llegada no puede ser mayor a 3 horas despues de la salida" })
    }

    // se valida que la hora de entrada no sea mayor a las 8:00 AM para entrada, y para salida no mayor a 5:00 PM
    switch (idRouteWay) {
        case 1:
            date.setHours(0, 0, 0, 0)
            date.setHours(date.getHours() + 8)

            const startLimitTime = date.toTimeString().slice(0, 5)
            
            if(startTime > startLimitTime) {
                return res.status(400).json({ errorCode: "START_TIME_EXCEED_GOING", message: "La hora de inicio de viaje no puede ser mayor a las 8:00 AM" })
            }

        break
        case 2:
            date.setHours(0, 0, 0, 0)
            date.setHours(date.getHours() + 17)
            
            const returnLimitTime = date.toTimeString().slice(0, 5)
            
            if(startTime < returnLimitTime) {
                return res.status(400).json({ errorCode: "START_TIME_EXCEED_RETURN", message: "La hora de inicio de viaje no puede ser menor a las 5:00 PM" })
            }

        break
    }
    
    // se inactivan todas las demas rutas del user del mismo tipo de ruta
    const updateRouteStatus = await DB.query(`
        UPDATE UserRoutes
            SET idStatus = 2
        WHERE idRouteWay = :idRouteWay
        AND idUsers = :idUser
    `, {
        replacements: { idRouteWay: idRouteWay, idUser: getIdUser.idUsers}
    })

    try {
        const route = await UserRoutes.create({ startingPoint, arrivalPoint, idStatus, idUsers, idRouteWay, startTime, arrivalTime, routeInfo, active })
        res.status(200).json(route, updateRouteStatus)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Ocurrio un error al crear una ruta: ", error})
    }
}

// llama las rutas de el usuario (activas e inactivas)
const getUserRoute = async (req, res) => {
    try {     
        // conseguimos la info del usuario actual
        const userId = req.params.id
        const getIdUser = await Users.findOne({
            where: {idUsers: userId}
        })
    
        if(!getIdUser) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
    
        const idUser = getIdUser.idUsers

        // hacemos una consulta a todas las rutas de llegada que tenga el usuario
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
            WHERE UserRoutes.idUsers = :idUser AND UserRoutes.active = 1`, {
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
        // conseguimos la info del usuario actual
        const userId = req.params.id
        const getIdUser = await Users.findOne({
            where: {idUsers: userId}
        })
    
        if(!getIdUser) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
    
        const idUser = getIdUser.idUsers

        // desactiva todas las rutas del usuario
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
        // se consigue la info de la ruta
        const route = await UserRoutes.findByPk(req.params.id)

        const idUser = route.idUsers
        const idRouteWay = route.idRouteWay

        // desactiva todas las rutas del usuario que tengan el mismo tipo de ruta
        const disableOtherRoutes = await DB.query(`
            UPDATE UserRoutes
                SET idStatus = '2'
            WHERE idUsers = :idUser AND idRouteWay = :idRouteWay`,{
                replacements: {idUser, idRouteWay}
            })

        // activa/desactiva la ruta seleccionada
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

// acepta una solicitud (correo)
const requestActions = async (req, res) => {
    try {
        const { reqAccepted, reqRejected } = req.body

        const acceptedRequestsByUser  = {}
        const rejectedRequestsByUser  = {}
        
        // ACEPTADAS
        for(const req of reqAccepted) {
            // busacmos la info de la solicitud
            const reqInfo = await Request.findByPk(req)

            if(!reqInfo) continue

            // validamos que no este aceptada o rechazada la solicitud
            if(reqInfo.idStatusReq !== 1) continue

            // actualizamos el estatus de la solicitud
            await Request.update({ idStatusReq: 2 }, { where: { idRequest: req } })

            // buscamos toda la info necesaria
            const routeData = await UserRoutes.findByPk(reqInfo.idRoute) // ruta
            const userOwnerData = await Users.findByPk(routeData.idUsers) // conductor
            const userData = await Users.findByPk(reqInfo.idUserReq) // solicitante

            // conseguimos el dia solicitado del viaje
            const reqData = await DB.query(`
                SELECT
                    FORMAT(Req.dayRequest, 'dddd dd "de" MMMM "de" yyyy', 'es-ES') as dayReq
                FROM Requests Req
                WHERE idRequest = :id
            `, {
                replacements: { id: req },
                type: DB.QueryTypes.SELECT
            })

            if(userData) {
                if(!acceptedRequestsByUser[userData.email]) acceptedRequestsByUser[userData.email] = []
                acceptedRequestsByUser[userData.email].push({
                    routeData,
                    userData,
                    userOwnerData,
                    reqData,
                    request: reqInfo
                })
            }
        }

        // RECHAZADAS
        for(const req of reqRejected) {
            // buscamos la info de la solicitud
            const reqInfo = await Request.findByPk(req)

            if(!reqInfo) continue

            // validamos que no este aceptada o rechazada la solicitud
            if(reqInfo.idStatusReq !== 1) continue

            // actualizamos el estatus de la solicitud
            await Request.update({ idStatusReq: 3 }, { where: { idRequest: req } })

            // buscamos toda la info necesaria
            const routeData = await UserRoutes.findByPk(reqInfo.idRoute) // ruta
            const userOwnerData = await Users.findByPk(routeData.idUsers) // conductor
            const userData = await Users.findByPk(reqInfo.idUserReq) // solicitante

            // conseguimos el dia solicitado del viaje
            const reqData = await DB.query(`
                SELECT 
                    FORMAT(Req.dayRequest, 'dddd dd "de" MMMM "de" yyyy', 'es-ES') as dayReq
                FROM Requests Req
                WHERE idRequest = :id
            `, {
                replacements: { id: req },
                type: DB.QueryTypes.SELECT
            })

            if(userData) {
                if(!rejectedRequestsByUser[userData.email]) rejectedRequestsByUser[userData.email] = []
                rejectedRequestsByUser[userData.email].push({
                    routeData,
                    userData,
                    userOwnerData,
                    reqData,
                    request: reqInfo
                })
            }
        }

        // mandamos los correos de las solicitudes aceptadas
        for (const [email, requests] of Object.entries(acceptedRequestsByUser)) {
            const { userData, routeData, userOwnerData } = requests[0]
            const reqList = requests.map(r => r.reqData[0].dayReq)
            const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${email}&topicName=Solicitud%20de%20ruta%20CARPOOL`

            // enviamos correo
            const message = emailTemplates.aceptacionRuta(userData, routeData, reqList, teamsUrl)
            await sendEmail(email, "Solicitud(es) de ruta aceptada(s)", message)
                .catch(err => console.error("Error al enviar correo aceptado:", err))

            // enviamos evento sse
            sendEventToUser((userData.username), { 
                type: "accepted-request",
                timestamp: Date.now(),
                username: (userOwnerData.username)
            })
        }

        
        // mandamos los correos de las solicitudes rechazadas
        for (const [email, requests] of Object.entries(rejectedRequestsByUser)) {
            const { userData, routeData, userOwnerData } = requests[0]
            const reqList = requests.map(r => r.reqData[0].dayReq)
            const message = emailTemplates.rechazoRuta(userData, routeData, reqList)

            // enviamos correo
            await sendEmail(email, "Solicitud(es) de ruta rechazada(s)", message)
                .catch(err => console.error("Error al enviar correo rechazado:", err))
        }
        
        res.status(200).json({ acceptedRequestsByUser, rejectedRequestsByUser })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: `Ocurrio un error al aceptar la solicitud: ${error.message}`})
    }
}

// llama a todas las solicitudes de un conductor
const getAllUserRequest = async (req, res) => {
    try {
        // conseguimos la info del usuario actual
        const userId = req.params.id

        // hacemos una consulta de todas las solicitudes que tiene pendiente el usuario
        const requests = await DB.query(`
            SELECT 
                Req.idRequest as idReq,
                userReq.name as reqOwner,
                userReq.email as reqEmail,
                FORMAT(Req.dayRequest, 'dddd dd "de" MMMM "de" yyyy', 'es-ES') as dayReq,
                Req.idRoute as idRoute,
                userRoute.name as routeOwner
            FROM Requests Req
            LEFT JOIN UserRoutes Routes ON Routes.idUserRoutes = Req.idRoute
            LEFT JOIN Users userRoute ON userRoute.idUsers = Routes.idUsers
            LEFT JOIN Users userReq ON userReq.idUsers = Req.idUserReq
            WHERE Req.idStatusReq = 1 
                AND Routes.idUsers = :idDriver
        `, {
            replacements: { idDriver: userId },
            type: DB.QueryTypes.SELECT
        })

        if(!requests) {
            return res.status(404).json({message: "No se encontro ninguna solicitud"})
        }

        res.status(200).json(requests)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al llamar a todas las solicitud", error})
    }
}

// llama a todos los viajes pendientes
const getAllRides = async (req, res) => {
    try {
        // conseguimos la info del usuario actual
        const userId = req.params.id
        const user = await Users.findOne({ 
            where: { idUsers: userId }
        })

        // le hacemos una consulta a todos los viajes que tiene pendiente el usuario en la semana en curso
        const getUserRides = await DB.query(`
            SET LANGUAGE SPANISH
            SELECT
                Req.idRequest as idReq,
                userReq.name as solicitante,
                userReq.email as solicitanteCorreo,
                DATENAME(WEEKDAY, Req.dayRequest) as diaSolicitado,
                RouteWay.routeWay as tipoRuta,
                DATEPART(WEEK, Req.dayRequest) as semanaSolicitada,
                FORMAT(Req.dayRequest, 'dddd dd "de" MMMM "de" yyyy', 'es-ES') as fechaSolicitada,
                CONVERT(varchar, Req.dayRequest, 23) as fechaViaje,
                Routes.startTime as horaSalida,
                Routes.arrivalTime as horaLlegada,
                Req.idRoute as idRutaDelViaje,
                Req.dateRegister as fechaSolicitud
            FROM Requests Req
            LEFT JOIN UserRoutes Routes ON Routes.idUserRoutes = Req.idRoute
            LEFT JOIN Users userRoute ON userRoute.idUsers = Routes.idUsers
            LEFT JOIN Users userReq ON userReq.idUsers = Req.idUserReq
            INNER JOIN RouteWay ON RouteWay.idRouteWay = Routes.idRouteWay
            WHERE Req.dayRequest >= CONVERT(varchar, GETDATE(), 23)
                AND Routes.idUsers = :idUser
                AND	Req.idStatusReq = 2
            ORDER BY Req.dayRequest
        `, {
            replacements: { idUser: user.idUsers },
            type: DB.QueryTypes.SELECT
        })

        if(!getUserRides) {
            return res.status(404).json({message: "No se encontro ningun viaje pendiente"})
        }

        res.status(200).json(getUserRides)
    } catch (error) {
        res.status(500).json({message: "Ocurrió un error al llamar a todas los viajes pendientes", error})
    }
}

// eliminado logico de una ruta
const deleteUserRoute = async (req, res) => {
    try {
        // actualizamos la ruta a inactiva
        const inactiveRoute = await UserRoutes.update({ idStatus: 2, active: 0 }, { where: { idUserRoutes: req.params.id } })

        res.status(200).json(inactiveRoute)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Ocurrió un error querer eliminar la ruta", error})
    }
}

module.exports = {
    changeStatus,
    createRoute,
    getUserRoute,
    disableAllUserRoutes,
    changeRouteStatus,
    requestActions,
    getAllUserRequest,
    getAllRides,
    deleteUserRoute
}