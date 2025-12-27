const express = require("express")
const app = express()
app.use(express.json())
require("dotenv").config({ path: "./.env" })

// permitimos solo peticiones de este origen solamente
const cors = require("cors")
app.use(cors({
    origin: process.env.FRONTEND,
    credentials: true,
    allowedHeaders: ["Content-Type"]
}))

// llamamos a todas las rutas
const userRoute = require("./routes/userRoute")
const passengerRoute = require("./routes/passengerRoute")
const driverRoute = require("./routes/driverRoute")
const sseRoute = require("./routes/sseRoute")

// exponemos los endpoints
app.use("/carpool/user", userRoute)
app.use("/carpool/passenger", passengerRoute)
app.use("/carpool/driver", driverRoute)
app.use("/sse", sseRoute)

// llamamos a las conexiones a las base de datos
const DB = require("./config/connectDB")

async function testDBConnect() {
    try {
        await DB.authenticate()
        console.log("Se conececto correctamente a la DB")
        
    } catch (error) {
        console.error("Fallo al tratar de conectarse a la DB, por el siguiente error: ", error)
    }    
}
testDBConnect()

// le asignamos el puerto donde correra el servidor
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})