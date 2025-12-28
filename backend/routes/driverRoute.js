const router = require("express").Router()
const { changeStatus, createRoute, getUserRoute, disableAllUserRoutes, changeRouteStatus, getAllUserRequest, getAllRides, requestActions, deleteUserRoute } = require("../controller/driverController")

router.put("/changeStatus/:id", changeStatus)
router.post("/createRoute/:id", createRoute)
router.get("/getUserRoute/:id", getUserRoute)
router.put("/allRoute/disable/:id", disableAllUserRoutes)
router.put("/route/active/:id", changeRouteStatus)

router.put("/request/actions", requestActions)

router.get("/request/getAll/:id", getAllUserRequest)
router.get("/rides/getAll/:id", getAllRides)
router.put("/route/delete/:id", deleteUserRoute)

module.exports = router