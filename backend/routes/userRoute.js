const router = require("express").Router()
const { getActualUser, getUser, getAllUsers, createUser, deleteUser, searchUser } = require("../controller/userController")

router.get("/getActualUser", getActualUser)
router.get("/get/:id", getUser)
router.get("/getAll", getAllUsers)
router.post("/create", createUser)
router.delete("/delete/:id", deleteUser)
router.post("/search", searchUser)

module.exports = router