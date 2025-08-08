const DB = require("../config/connectDB")
//modelos
const Users = require("../model/usersModel")
const UserRoutes = require("../model/userRoutesModel.js")
const Request = require("../model/requestModel.js")
// servicios
const sendEmail = require("../service/sendEmailService")
const { sendEventToUser } = require("../service/sseService")

// estilos para el correo
const style = ` 
    <style>
        /* Botón Aceptar */
            .button-aceptar {
            padding: 12.5px 30px;
            border: 0;
            border-radius: 100px;
            background-color: #2dda16;
            color: #ffffff;
            font-weight: bold;
            transition: all 0.5s;
            -webkit-transition: all 0.5s;
            cursor: pointer;
        }

        /* Botón Negar */
            .button-negar {
            padding: 12.5px 30px;
            border: 0;
            border-radius: 100px;
            background-color: #f51818;
            color: #ffffff;
            font-weight: bold;
            transition: all 0.5s;
            -webkit-transition: all 0.5s;
            cursor: pointer;
        }

        /* Botón Teams */
            .button-teams {
            padding: 12.5px 30px;
            border: 0;
            border-radius: 100px;
            background-color: #444791;
            color: #ffffff;
            font-weight: bold;
            transition: all 0.5s;
            -webkit-transition: all 0.5s;
            cursor: pointer;
        }

        /* Botón Rutas Carpool */
            .button-carpool {
            padding: 12.5px 30px;
            border: 0;
            border-radius: 100px;
            background-color: #333333;
            color: #ffffff;
            font-weight: bold;
            transition: all 0.5s;
            -webkit-transition: all 0.5s;
            cursor: pointer;
        }

        /* Layout General */
        .container {
            font-family: Arial, sans-serif;
            color: #333333;
            padding: 20px;
            max-width: auto;
            margin: auto;
        }

        .padding {
            padding-top: 5%;
        }
        .footer {
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .footer-left {
            position:absolute;
            color: white; 
            pointer-events: none;
            user-select: none;
        }

        .centered {
            text-align: center;
        }

        .spaced-buttons {
            display: flex;
            justify-content: center;
            margin-top: 5%;
        }

        .spaced-buttons button + button {
            margin-left: 10%;
        }
    </style>`

// covierte StartTime a horas
const formatHour = (time) => {
    const date = new Date(time)
    const hours = date.getUTCHours().toString().padStart(2, "0")
    const minutes = date.getUTCMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
}

// controladores
// cambia el estatus a 2 (PASSENGER)
const changeStatus = async (req, res) => {
    try {
        // conseguimos la info del usuario actual
        const USER = process.env.USERNAME
        const user = await Users.findOne({ 
            where: { username: USER }
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
    const user = process.env.USERNAME
    const getIdUser = await Users.findOne({
        where: {username: user}
    })

    const { startingPoint, arrivalPoint, idStatus, idUsers, idRouteWay, startTime, arrivalTime, routeInfo } = req.body
    
    // se valida que contenga todos los campos obligatorios
    if(!startingPoint || !arrivalPoint || !idStatus || !idUsers || !idRouteWay || !startTime || !arrivalTime || !routeInfo) {
        return res.status(400).json({ errorCode: "FIELDS_MISSING", message: "Faltan campos obligatorios" })
    }
    
    // valida que el tiempo de llegada no sea menor al de salida
    if(startTime > arrivalTime) {
        return res.status(400).json({ errorCode: "START_ABOVE_ARRIVAL", message: "La hora de salida no puede ser mayor a la de llegada" })
    }

    // le sumamos 4 horas al tiempo de salida
    const [hours, min] = startTime.split(":").map(Number)
    const date = new Date()

    date.setHours(hours, min, 0, 0)
    date.setHours(date.getHours() + 3)

    const limmitTime = date.toTimeString().slice(0, 5)

    // validamos que el tiempo de llegada no sea mayor a 4 horas despues de la hora de salida
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
                return res.status(400).json({ errorCode: "START_TIME_EXCEED_GOING", message: "La hora de salida no puede ser mayor a las 8:00 AM" })
            }

            break
        case 2:
            date.setHours(0, 0, 0, 0)
            date.setHours(date.getHours() + 17)
            
            const returnLimitTime = date.toTimeString().slice(0, 5)
            console.log("Despues" + returnLimitTime)
            
            if(startTime < returnLimitTime) {
                return res.status(400).json({ errorCode: "START_TIME_EXCEED_RETURN", message: "La hora de salida no puede ser menor a las 5:00 PM" })
            }

            break
    }
    
    // se inactivan todas las demas rutas del user del mismo tipo de ruta
    const updateRouteStatus = DB.query(`
        UPDATE UserRoutes
            SET idStatus = 2
        WHERE idRouteWay = :idRouteWay
        AND idUsers = :idUser
    `, {
        replacements: { idRouteWay: idRouteWay, idUser: getIdUser.idUsers}
    })

    try {
        const route = await UserRoutes.create({ startingPoint, arrivalPoint, idStatus, idUsers, idRouteWay, startTime, arrivalTime, routeInfo })
        res.status(200).json(route, updateRouteStatus)
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al crear una ruta: ", error})
    }
}

// llama las rutas de el usuario (activas e inactivas)
const getUserRoute = async (req, res) => {
    try {     
        // conseguimos la info del usuario actual
        const user = process.env.USERNAME
        const getIdUser = await Users.findOne({
            where: {username: user}
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
        // conseguimos la info del usuario actual
        const user = process.env.USERNAME
        const getIdUser = await Users.findOne({
            where: {username: user}
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
const requestAccepted = async (req, res) => {
    try {
        // busamos la solicitud
        const acceptedRequest = await Request.findByPk(req.params.id)

        if(!acceptedRequest) {
            return res.status(404).json({message: "solicitud no encontrada"})
        }

        // validamos que no este aceptada o rechazada la solicitud
        if(acceptedRequest.idStatusReq !== 1) {
            return res.status(400).json({message: "no se pueden aceptar/rechazar solicitudes ya aceptadas/rechazadas"})
        }

        // actualizamos el estatus de la solicitud 
        const idRequest = acceptedRequest.idRequest

        const updateRequest = await DB.query(`
            UPDATE Requests 
                set idStatusReq = 2
            WHERE idRequest = :idRequest `, {
                replacements: {idRequest}
            })

        // conseguimos la info del solicitante
        const idUserReq = acceptedRequest.idUserReq
        
        const userReq = await Users.findOne({
            where: { idUsers: idUserReq }
        })
        
        const email = userReq.email

        // conseguimos la info del conductor
        const idRoute = acceptedRequest.idRoute

        const userRoute = await UserRoutes.findOne({
            where: { idUserRoutes: idRoute }
        })

        const userDriver = await Users.findOne({
            where: { idUsers: userRoute.idUsers }
        })

        // enviamos evento sse
        sendEventToUser(String(userReq.idUsers), { 
            type: "accepted-request", 
            timestamp: Date.now(),
            userId: String(userReq.idUsers)
        })
        
        
        res.status(200).json({message: "Solicitud aceptada: ", updateRequest})
        
        // se manda correo al solicitante notificandole que se acepto su solicitud        
        const teamsUrl = `https://teams.microsoft.com/l/chat/0/0?users=${userDriver.email}&topicName=Solicitud%20de%20ruta%20CARPOOL`

        sendEmail(email, "¡Han aceptado una solicitud tuya!", `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Solicitud de Ruta</title>
                ${style}
            </head>

            <body>
                <div class="container">
                    <div class="centered">
                        <hr style="border: none; border-top: 2px solid #ccc; width: 100%; margin: 0 0 10px 0;">
                        <h2 style="margin: 0; display: inline-block; font-size: 20px; color:#1163ff;">¡Solicitud Aceptada!</h2>
                        <hr style="border: none; border-top: 2px solid #ccc; width: 100%; margin: 10px 0 0 0;">
                    </div>

                    <div style="font-size: 16px; line-height: 1.6; font-family: Arial, sans-serif; color: #333;">
                        <p style="padding-top: 20px;">
                            El conductor <strong>${userDriver.name}</strong> ha aceptado tu solicitud para la siguiente ruta: 
                        </p>

                        <div style="margin-top: 15px;">
                            <p style="margin: 0 0 8px 0; font-weight: bold; color: #1163ff;">Datos de la Ruta:</p>

                            <ul style="list-style: none; padding-left: 0; margin: 0;">
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Punto de salida:</strong> ${userRoute.startingPoint}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Punto de llegada:</strong> ${userRoute.arrivalPoint}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Hora de inicio de viaje:</strong> ${formatHour(userRoute.startTime)}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Hora de llegada:</strong> ${formatHour(userRoute.arrivalTime)}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Fecha de viaje:</strong> ${acceptedRequest.dayRequest}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <p style="font-size:16px; line-height:1.5;">
                        Por favor, pongase en contacto con el conductor:
                    </p>

                    <div class="spaced-buttons">
                        <div class="button-teams">
                            <img src="cid:iconoTeams.png" style="height: 20px; width: auto;" />
                            <a class="button-teams" href="${teamsUrl}">Mensaje via teams</a>
                        </div>
                    </div>

                    <div class="padding">
                        <div class="footer">
                            <div class="footer-left">
                                <img src="cid:CorreoHeader.png" style="height: 40px; width: auto;" />
                            </div>

                            <div class="footer-center"></div>

                            <div class="footer-rigth">
                                <img src="cid:logoGpAzul.png" style="height: 40px; width: auto;" />
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>`
        ).catch(error => console.error("Error al enviar correo: ", error))

    } catch (error) {
        res.status(500).json({message: `Ocurrio un error al aceptar la solicitud: ${error.message}`})
    }
}

// recahza una solicitud (correo)
const requestRejected = async (req, res) => {
    try {
        // buscamos la solicitud
        const rejectedRequest = await Request.findByPk(req.params.id)

        if(!rejectedRequest) {
            res.status(404).json({message: "solicitud no encontrada"})
        }

        // validamos que no este rechazada o aceptada la solicitud
        if(rejectedRequest.idStatusReq !== 1) {
            return res.status(400).json({message: "no se pueden aceptar/rechazar solicitudes ya aceptadas/rechazadas"})
        }

        // actualizamos el estatus de la solicitud
        const idRequest = rejectedRequest.idRequest

        const updateRequest = await DB.query(`
            UPDATE Requests 
                set idStatusReq = 3
            WHERE idRequest = :idRequest `, {
                replacements: {idRequest}
            })

        // conseguimos la info del solicitante
        const idUserReq = rejectedRequest.idUserReq
        
        const userReq = await Users.findOne({
            where: { idUsers: idUserReq }
        })
        
        const email = userReq.email

        // conseguimos la info del conductor
        const idRoute = rejectedRequest.idRoute

        const userRoute = await UserRoutes.findOne({
            where: { idUserRoutes: idRoute }
        })

        const userDriver = await Users.findOne({
            where: { idUsers: userRoute.idUsers }
        })

        
        res.status(200).json({message: "Solicitud denegada: ", updateRequest})

        // se manda correo al solicitante notificandole que se denego su solicitud
        sendEmail(email, "Se ha rechazado una solicitud tuya", `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Solicitud de Ruta</title>
                ${style}
            </head>

            <body>
                <div class="container">
                    <div class="centered">
                        <hr style="border: none; border-top: 2px solid #ccc; width: 100%; margin: 0 0 10px 0;">
                        <h2 style="margin: 0; display: inline-block; font-size: 20px; color:#1163ff;">Solicitud rechazada</h2>
                        <hr style="border: none; border-top: 2px solid #ccc; width: 100%; margin: 10px 0 0 0;">
                    </div>

                    <div style="font-size: 16px; line-height: 1.6; font-family: Arial, sans-serif; color: #333;">
                        <p style="padding-top: 20px;">
                            El conductor <strong>${userDriver.name}</strong> ha rechazado tu solicitud para la siguiente ruta: 
                        </p>

                        <div style="margin-top: 15px;">
                            <p style="margin: 0 0 8px 0; font-weight: bold; color: #1163ff;">Datos de la Ruta:</p>

                            <ul style="list-style: none; padding-left: 0; margin: 0;">
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Punto de salida:</strong> ${userRoute.startingPoint}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Punto de llegada:</strong> ${userRoute.arrivalPoint}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Hora de inicio de viaje:</strong> ${formatHour(userRoute.startTime)}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Hora de llegada:</strong> ${formatHour(userRoute.arrivalTime)}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Fecha de viaje:</strong> ${rejectedRequest.dayRequest}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <p style="font-size:16px; line-height:1.5;">
                        Puede seguir solicitando rutas en CARPOOL:
                    </p>

                    <div class="spaced-buttons">
                        <div class="button-carpool">
                            <a class="button-carpool" href="http://localhost:5173/">Ver rutas CARPOOL</a>
                        </div>
                    </div>

                    <div class="padding">
                        <div class="footer">
                            <div class="footer-left">
                                <img src="cid:CorreoHeader.png" style="height: 40px; width: auto;" />
                            </div>

                            <div class="footer-center"></div>

                            <div class="footer-rigth">
                                <img src="cid:logoGpAzul.png" style="height: 40px; width: auto;" />
                            </div>
                        </div>
                    </div>
                </div>
            </body>
            </html>`
        ).catch(error => console.error("Error al enviar correo: ", error))
        
    } catch (error) {
        res.status(500).json({message: `Ocurrio un error al rechazar la solicitud: ${error.message}`})
    }
}

// llama a todas las solicitudes de un conductor
const getAllUserRequest = async (req, res) => {
    try {
        // conseguimos la info del usuario actual
        const USER = process.env.USERNAME
        const user = await Users.findOne({ 
            where: { username: USER }
        })

        // hacemos una consulta de todas las solicitudes que tiene pendiente el usuario
        const requests = await DB.query(`
            SELECT 
                Req.idRequest as idReq,
                userReq.name as reqOwner,
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
            replacements: { idDriver: user.idUsers },
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
        const USER = process.env.USERNAME
        const user = await Users.findOne({ 
            where: { username: USER }
        })

        // le hacemos una consulta a todos los viajes que tiene pendiente el usuario en la semana en curso
        const getUserRides = await DB.query(`
            SET LANGUAGE SPANISH
            SELECT
                Req.idRequest as idReq,
                userReq.name as solicitante,
                DATENAME(WEEKDAY, Req.dayRequest) as diaSolicitado,
                RouteWay.routeWay as tipoRuta,
                DATEPART(WEEK, Req.dayRequest) as semanaSolicitada,
                FORMAT(Req.dayRequest, 'dddd dd "de" MMMM "de" yyyy', 'es-ES') as fechaSolicitada,
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

module.exports = {
    changeStatus,
    createRoute,
    getUserRoute,
    disableAllUserRoutes,
    changeRouteStatus,
    requestAccepted,
    requestRejected,
    getAllUserRequest,
    getAllRides
}