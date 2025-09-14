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
                AND CAST(dateRegister AS DATE) = CAST(GETDATE() AS DATE)
            ) AS R ON R.idRoute = UserRoutes.idUserRoutes
            LEFT JOIN StatusReq ON StatusReq.idStatusReq = R.idStatusReq
            WHERE UserRoutes.idStatus = 1
            AND RouteWay.idRouteWay = 1
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

        // validamos que no se pueda solicitar si esta inactiva
        if(routeRequested.idStatus === 2) {
            return res.status(501).json({message: "No se pudo solicitar la ruta ya que esta inactiva"})
        }
        
        // conseguimos la info del solicitador
        const { userId } = req.body
        const userReq = await Users.findOne({ 
            where: { idUsers: userId }
        })

        // guardamos todos los datos de la solicitud para luego hacer el post
        const idUserReq = userReq.idUsers
        const idRoute = id
        const idStatusReq = 1
        const { dayRequest } = req.body

        // consultamos que no haya una solicitud del userReq que sea en el mismo dia que esta solicitando
        const reqDates = await DB.query(`
            SELECT dayRequest, idRoute 
            FROM Requests 
            WHERE dayRequest = :dayRequest AND idRoute = :idRoute
            `, {
                replacements: { dayRequest: dayRequest, idRoute: idRoute},
                type: DB.QueryTypes.SELECT
            })
        
        if(reqDates.length > 0) {
            return res.status(400).json({message: "Ya has solicitado esta ruta en el mismo dia"})
        }

        // hacemos el post
        const request = await Request.create({ idUserReq, idRoute, idStatusReq, dayRequest })
        
        // enviamos evento sse
        sendEventToUser(String(user.idUsers), { 
            type: "new-request", 
            timestamp: Date.now(),
            userId: String(user.idUsers)
        })

        // se manda el correo
        const frontendUrl = "http://localhost:5173"
        
        const acceptUrl = `${frontendUrl}/confirm-request?idRequest=${request.idRequest}&action=accepted`
        const rejectedUrl = `${frontendUrl}/confirm-request?idRequest=${request.idRequest}&action=rejected`
        
        await sendEmail(email, "¡Han solicitado una ruta tuya!", `
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
                        <h2 style="margin: 0; display: inline-block; font-size: 20px; color:#1163ff;">¡Solicitud de Ruta!</h2>
                        <hr style="border: none; border-top: 2px solid #ccc; width: 100%; margin: 10px 0 0 0;">
                    </div>

                    <div style="font-size: 16px; line-height: 1.6; font-family: Arial, sans-serif; color: #333;">
                        <p style="padding-top: 20px;">
                            El usuario <strong>${userReq.name}</strong> te ha solicitado la ruta con ID: 
                            <strong>${routeRequested.idUserRoutes}</strong>.
                        </p>

                        <div style="margin-top: 15px;">
                            <p style="margin: 0 0 8px 0; font-weight: bold; color: #1163ff;">Datos de la Ruta:</p>

                            <ul style="list-style: none; padding-left: 0; margin: 0;">
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Punto de salida:</strong> ${routeRequested.startingPoint}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Punto de llegada:</strong> ${routeRequested.arrivalPoint}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Hora de inicio de viaje:</strong> ${formatHour(routeRequested.startTime)}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Hora de llegada:</strong> ${formatHour(routeRequested.arrivalTime)}
                                </li>
                                <li style="margin-bottom: 6px; padding-left: 15px;">
                                    - <strong>Fecha de viaje solicitada:</strong> ${dayRequest}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <p style="font-size:16px; line-height:1.5;">
                        Por favor, acepta o niega la solicitud:
                    </p>

                    <div class="spaced-buttons">
                        <a class="button-aceptar" style="margin-right: 40px;" href="${acceptUrl}">Aceptar</a>
                        <a class="button-negar" href="${rejectedUrl}">Negar</a>
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
        )
        
        res.status(200).json({message: "Solicitud / correo mandado de forma exitosa: ", request})
    } catch (error) {
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
                USers.name as nameDriver,
                Users.email as emailDriver,
                Routes.startingPoint as start,
                Routes.arrivalPoint as arrival,
                Routes.startTime,
                Routes.arrivalTime,
                StatusReq.nameStatus,
                RouteWay.routeWay
            FROM Requests Req
            INNER JOIN UserRoutes Routes ON Routes.idUserRoutes = Req.idRoute
            INNER JOIN Users ON Users.idUsers = Routes.idUsers
            INNER JOIN Status ON Status.idStatus = Routes.idStatus
            LEFT JOIN StatusReq ON StatusReq.idStatusReq = Req.idStatusReq
            LEFT JOIN RouteWay ON RouteWay.idRouteWay = Routes.idRouteWay
            WHERE Req.idUserReq = :idUsers
                AND Req.idStatusReq = 2
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

module.exports = {
    getAllGoingRoute,
    getAllReturnRoute,
    changeStatus,
    sendRequest,
    getRequest,
    getAcceptedRequest
}