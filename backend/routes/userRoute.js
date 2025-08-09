const router = require("express").Router()
const { registerUser, loginUser, getActualUser, getUser, getAllUsers, deleteUser, searchUser } = require("../controller/userController")

router.post("/register", registerUser)
router.post("/login", loginUser)

router.get("/getActualUser", getActualUser)
router.get("/get/:id", getUser)
router.get("/getAll", getAllUsers)
router.delete("/delete/:id", deleteUser)
router.post("/search", searchUser)

module.exports = router