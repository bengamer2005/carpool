// convierte StartTime a horas
const formatHour = (time) => {
    const date = new Date(time)
    const hours = date.getUTCHours().toString().padStart(2, "0")
    const minutes = date.getUTCMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
}

// convierte fechas a dias leibles
const formatDate = (date) => {
    const [year, month, day] = date.split("-")

    const fecha = new Date(year, month -1, day)
    const opciones = { weekday: "long", year: "numeric", month: "long", day: "numeric" }

    return new Intl.DateTimeFormat("es-ES", opciones).format(fecha)
}

const emailTemplates = {
    // Template para solicitud de ruta
    solicitudRuta: (userReq, routeRequested, dayRequest) => `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Solicitud de ruta</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 30px;
                }
                
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                }
                
                .header hr {
                    border: none;
                    border-top: 2px solid #e0e0e0;
                    margin: 10px 0;
                }
                
                .header h2 {
                    margin: 10px 0;
                    font-size: 24px;
                    color: #1163ff;
                    font-weight: 600;
                }
                
                .content {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #333333;
                    padding: 20px 0;
                }
                
                .route-details {
                    border-left: 4px solid #1163ff;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                
                .route-details h3 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    color: #1163ff;
                }
                
                .route-details ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .route-details li {
                    margin-bottom: 12px;
                    padding-left: 20px;
                    position: relative;
                }
                
                .route-details li:before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: #1163ff;
                    font-weight: bold;
                }
                
                .cta-section {
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 25px 0;
                }
                
                .btn {
                    display: inline-block;
                    padding: 14px 35px;
                    border: none;
                    border-radius: 50px;
                    font-weight: bold;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    font-size: 16px;
                }
                
                .btn-primary {
                    background-color: #1163ff;
                    color: #ffffff;
                }
                
                .btn-primary:hover {
                    background-color: #0d4fd8;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(17, 99, 255, 0.3);
                }
                
                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 30px;
                    margin-top: 30px;
                    border-top: 2px solid #e0e0e0;
                }
                
                .footer img {
                    height: 10px;
                    width: auto;
                }
                
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 20px;
                    }
                    
                    .btn {
                        padding: 12px 25px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <hr>
                    <h2>Solicitud de ruta</h2>
                    <hr>
                </div>

                <div class="content">
                    <p>
                        El usuario <strong>${userReq.name}</strong> te ha <strong>solicitado la ruta</strong> con <strong>ID: ${routeRequested.idUserRoutes}</strong>:
                    </p>

                    <div class="route-details">
                        <h3>Datos de la ruta</h3>
                        <ul>
                            <li><strong>Punto de salida:</strong> ${routeRequested.startingPoint}</li>
                            <li><strong>Punto de llegada:</strong> ${routeRequested.arrivalPoint}</li>
                            <li><strong>Hora de inicio:</strong> ${formatHour(routeRequested.startTime)}</li>
                            <li><strong>Hora de llegada:</strong> ${formatHour(routeRequested.arrivalTime)}</li>

                            <li style="margin-bottom: 6px; padding-left: 15px;">
                                <strong>Fecha de viaje solicitada(s):</strong>
                                <ul style="list-style: none; padding-left: 15px; margin: 0;">
                                    ${dayRequest.map(d => `<li>${formatDate(d)}</li>`).join("")}
                                </ul>
                            </li>

                    </div>

                    <div class="cta-section">
                        <p style="margin-bottom: 15px; font-size: 16px; color: #333;">
                            Favor de aceptar o rechazar la solicitud en 
                            <a href="http://apps.ggp.com.mx/Carpool/" class="btn btn-primary">CARPOOL</a>
                        </p>
                    </div>
                </div>

                <!-- FOOTER COMPATIBLE CON OUTLOOK VIEJO -->
                <table width="80%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid #e0e0e0; margin-top:30px; padding-top:30px;">
                    <tr>
                        <td align="left" style="padding-top:30px;">
                            <img src="cid:CorreoHeader.png" alt="Logo" height="30" style="display:block; border:0; outline:none; text-decoration:none;">
                        </td>
                        <td align="right" style="padding-top:30px;">
                            <img src="cid:logoGpAzul.png" alt="Logo Empresa" height="30" style="display:block; border:0; outline:none; text-decoration:none;">
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
    `,

    // Template para aceptación de ruta
    aceptacionRuta: (userData, routeData, reqData, teamsUrl) => `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Solicitud de ruta aceptada</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 30px;
                }
                
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                }
                
                .header hr {
                    border: none;
                    border-top: 2px solid #e0e0e0;
                    margin: 10px 0;
                }
                
                .header h2 {
                    margin: 10px 0;
                    font-size: 24px;
                    color: #2dda16;
                    font-weight: 600;
                }
                
                .success-icon {
                    text-align: center;
                    font-size: 60px;
                    color: #2dda16;
                    margin: 20px 0;
                }
                
                .content {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #333333;
                    padding: 20px 0;
                }
                
                .route-details {
                    border-left: 4px solid #2dda16;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                
                .route-details h3 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    color: #2dda16;
                }
                
                .route-details ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .route-details li {
                    margin-bottom: 12px;
                    padding-left: 20px;
                    position: relative;
                }
                
                .route-details li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #2dda16;
                    font-weight: bold;
                }
                
                .cta-section {
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 25px 0;
                }
                
                .btn {
                    display: inline-block;
                    padding: 14px 35px;
                    border: none;
                    border-radius: 50px;
                    font-weight: bold;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    font-size: 16px;
                    margin: 5px;
                }
                
                .btn-success {
                    color: #ffffff;
                }
                
                .btn-success:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(45, 218, 22, 0.3);
                }
                
                .btn-secondary {
                    background-color: #444791;
                    color: #ffffff;
                }
                
                .btn-secondary:hover {
                    background-color: #363775;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(68, 71, 145, 0.3);
                }
                
                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 30px;
                    margin-top: 30px;
                    border-top: 2px solid #e0e0e0;
                }
                
                .footer img {
                    height: 10px;
                    width: auto;
                }
                
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 20px;
                    }
                    
                    .btn {
                        padding: 12px 25px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <hr>
                    <h2>Solicitud de ruta aceptada</h2>
                    <hr>
                </div>

                <div class="content">
                    <p>
                        El conductor <strong>${userData.name}</strong> ha <strong>aceptado tu solicitud</strong> para la siguiente ruta:
                    </p>

                    <div class="route-details">
                        <h3>Datos de la ruta:</h3>
                        <ul>
                            <li><strong>Punto de salida:</strong> ${routeData.startingPoint}</li>
                            <li><strong>Punto de llegada:</strong> ${routeData.arrivalPoint}</li>
                            <li><strong>Hora de inicio:</strong> ${formatHour(routeData.startTime)}</li>
                            <li><strong>Hora de llegada:</strong> ${formatHour(routeData.arrivalTime)}</li>

                            <li style="margin-bottom: 6px; padding-left: 15px;">
                                <strong>Fecha(s) del viaje:</strong>
                                <ul style="list-style: none; padding-left: 15px; margin: 0;">
                                    ${reqData.map(r => `<li>${r}</li>`).join("")}
                                </ul>
                            </li>

                        </ul>
                    </div>

                    <div class="cta-section">
                        <p style="margin-bottom: 15px; font-size: 16px; color: #333;">
                            Favor de ponerse en contacto con el conductor vía 
                            <a href="${teamsUrl}" class="btn btn-secondary">Teams</a>
                        </p>
                    </div>
                </div>

                <!-- FOOTER COMPATIBLE CON OUTLOOK VIEJO -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid #e0e0e0;">
                    <tr>
                        <td align="left" style="padding-top:30px;">
                            <img src="cid:CorreoHeader.png" alt="Logo" height="30" style="display:block; border:0; outline:none; text-decoration:none;">
                        </td>
                        <td align="right" style="padding-top:30px;">
                            <img src="cid:logoGpAzul.png" alt="Logo Empresa" height="30" style="display:block; border:0; outline:none; text-decoration:none;">
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
    `,

    // Template para rechazo de ruta
    rechazoRuta: (userData, routeData, reqData) => `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Solicitud de ruta rechazada</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, sans-serif;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 30px;
                }
                
                .header {
                    text-align: center;
                    padding-bottom: 20px;
                }
                
                .header hr {
                    border: none;
                    border-top: 2px solid #e0e0e0;
                    margin: 10px 0;
                }
                
                .header h2 {
                    margin: 10px 0;
                    font-size: 24px;
                    color: #f51818;
                    font-weight: 600;
                }
                
                .info-icon {
                    text-align: center;
                    font-size: 60px;
                    color: #f51818;
                    margin: 20px 0;
                }
                
                .content {
                    font-size: 16px;
                    line-height: 1.8;
                    color: #333333;
                    padding: 20px 0;
                }
                
                .route-details {
                    border-left: 4px solid #f51818;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 4px;
                }
                
                .route-details h3 {
                    margin: 0 0 15px 0;
                    font-size: 18px;
                    color: #f51818;
                }
                
                .route-details ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .route-details li {
                    margin-bottom: 12px;
                    padding-left: 20px;
                    position: relative;
                }
                
                .route-details li:before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: #f51818;
                    font-weight: bold;
                }
                
                .cta-section {
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    margin: 25px 0;
                }
                
                .btn {
                    display: inline-block;
                    padding: 14px 35px;
                    border: none;
                    border-radius: 50px;
                    font-weight: bold;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    font-size: 16px;
                    margin: 5px;
                }
                
                .btn-dark {
                    background-color: #333333;
                    color: #ffffff;
                }
                
                .btn-dark:hover {
                    background-color: #1a1a1a;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(51, 51, 51, 0.3);
                }
                
                .footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 30px;
                    margin-top: 30px;
                    border-top: 2px solid #e0e0e0;
                }
                
                .footer img {
                    height: 10px;
                    width: auto;
                }
                
                @media only screen and (max-width: 600px) {
                    .container {
                        padding: 20px;
                    }
                    
                    .btn {
                        padding: 12px 25px;
                        font-size: 14px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <hr>
                    <h2>Solicitud de ruta rechazada</h2>
                    <hr>
                </div>

                <div class="content">
                    <p>
                        El conductor <strong>${userData.name}</strong> ha <strong>rechazado tu solicitud</strong> para la siguiente ruta:
                    </p>

                    <div class="route-details">
                        <h3><strong>Datos de la ruta</strong></h3>
                        <ul>
                            <li><strong>Punto de salida:</strong> ${routeData.startingPoint}</li>
                            <li><strong>Punto de llegada:</strong> ${routeData.arrivalPoint}</li>
                            <li><strong>Hora de inicio:</strong> ${formatHour(routeData.startTime)}</li>
                            <li><strong>Hora de llegada:</strong> ${formatHour(routeData.arrivalTime)}</li>

                            <li style="margin-bottom: 6px; padding-left: 15px;">
                                <strong>Fecha(s) del viaje:</strong>
                                <ul style="list-style: none; padding-left: 15px; margin: 0;">
                                    ${reqData.map(r => `<li>${r}</li>`).join("")}
                                </ul>
                            </li>

                        </ul>
                    </div>

                    <div class="cta-section">
                        <p style="margin-bottom: 15px; font-size: 16px; color: #333;">
                            Puedes seguir solicitando nuevas rutas en 
                            <a href="http://apps.ggp.com.mx/Carpool/" class="btn btn-dark">CARPOOL</a>
                        </p>
                    </div>
                </div>

                <!-- FOOTER COMPATIBLE CON OUTLOOK VIEJO -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:2px solid #e0e0e0;">
                    <tr>
                        <td align="left" style="padding-top:30px;">
                            <img src="cid:CorreoHeader.png" alt="Logo" height="30" style="display:block; border:0; outline:none; text-decoration:none;">
                        </td>
                        <td align="right" style="padding-top:30px;">
                            <img src="cid:logoGpAzul.png" alt="Logo Empresa" height="30" style="display:block; border:0; outline:none; text-decoration:none;">
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>
    `
}

module.exports = emailTemplates