const express = require("express")
const app = express()
app.use(express.json())

const cors = require("cors")
app.use(cors({
    origin: "http://localhost:5173"
}))

// creamos los endpoints
const userRoute = require("./routes/userRoute")
const userDB = require("./routes/userDataRoute")
const passengerRoute = require("./routes/passengerRoute")
const driverRoute = require("./routes/driverRoute")
app.use("/carpool/user", userRoute)
app.use("/carpool/userData", userDB)
app.use("/carpool/passenger", passengerRoute)
app.use("/carpool/driver", driverRoute)

// creamos al conexion a las base de datos
const DB = require("./config/connectDB")
const UsersDB = require("./config/connectUserDataDB")

async function testDBConnect() {
    try {
        await DB.authenticate()
        console.log("Se conececto correctamente a la DB")

    } catch (error) {
        console.error("Fallo al tratar de conectarse a la DB, por el siguiente error: ", error)
    }    
}
testDBConnect()

async function userDBConnect() {
    try {
        await UsersDB.authenticate()
        console.log("Se conececto correctamente a la DB de los Users")
        
    } catch (error) {
        console.error("Fallo al tratar de conectarse a la DB, por el siguiente error: ", error)
    }    
}
userDBConnect()

// le asignamos el puerto donde correra el servidor
const port = 3000
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})

// sacar el user de windows 
app.get("/user", (req, res) => {
    const user = process.env.USERNAME
    res.json({ username: user})
})