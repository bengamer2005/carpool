const router = require("express").Router()
const { getAllUsers } = require("../controller/userDataController")

router.get("/users", getAllUsers)

module.exports = router