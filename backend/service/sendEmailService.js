const nodemailer = require("nodemailer")
require("dotenv").emailInfo

const info = nodemailer.createTransport({
    service: "outlook",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendEmail = async (to, subject, text) => {
    try {
        await info.sendMail({
            from: "benito.garcia@grupogp.com.mx",
            to,
            subject,
            text
        })
        console.log("correo enviado a: ", to)
    } catch (error) {
        console.error("error al mandar el email: ", error)
    }
}

module.exports = sendEmail