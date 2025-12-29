const router = require("express").Router()
const { addClient, removeClient } = require("../service/sseService")

router.get("/events", (req, res) => {
    
    // guardamos el id del user
    const username = req.query.username

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND)
    res.setHeader("Access-Control-Allow-Credentials", "false")

    res.flushHeaders()

    // se envia un mensaje inicial para que no se cierre la sesion
    res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

    // agregamos al usuario
    addClient(username, res)

    // mandamos el ping para que no se cierre la sesion por falta de datos en un largo tiempo
    const keepAlive = setInterval(() => {
        res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`)
    }, 20000)

    // si se desconecta lo removemos
    req.on("close", () => {
        clearInterval(keepAlive)
        removeClient(res)
    })
})

module.exports = router