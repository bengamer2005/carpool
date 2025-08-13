const router = require("express").Router()
const { registerUser, loginUser, getUser, getAllUsers } = require("../controller/userController")

router.post("/register", registerUser)
router.post("/login", loginUser)

router.get("/get/:id", getUser)
router.get("/getAll", getAllUsers)

module.exports = router