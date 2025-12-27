const router = require("express").Router()
const { addClient, removeClient } = require("../service/sseService")

router.get("/events", (req, res) => {
    
    // guardamos el id del user
    const userId = req.query.userId

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("connection", "keep-alive")
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL_PRODUCCION)
    res.setHeader("Access-Control-Allow-Credentials", "true")

    res.flushHeaders()

    // agregamos al usuario
    addClient(userId, res)

    // si se desconecta lo removemos
    req.on("close", () => {
        removeClient(res)
    })
})

module.exports = router