const nodemailer = require("nodemailer")

// pasamos los datos del correo que mandara los avisos
const info = nodemailer.createTransport({
    service: "outlook",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = async (to, subject, html) => {
    try {
        await info.sendMail({
            from: `"Carpool", <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            // llamamos a las img que se usan en el correo
            attachments: [{
                filename: "logoGpAzul.png",
                path: "../frontend/src/img/logoGpAzul.png",
                cid: "logoGpAzul"
            }, {
                filename: "CorreoHeader.png",
                path: "../frontend/src/img/CorreoHeader.png",
                cid: "CorreoHeader"
            }, {
                filename: "iconoTeams.png",
                path: "../frontend/src/img/iconoTeams.png",
                cid: "iconoTeams"
            }],
            bcc: process.env.EMAIL_PERSONAL
        })

    } catch (error) {
        console.error("error al mandar el email: ", error)
    }
}

module.exports = sendEmail