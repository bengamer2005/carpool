const router = require("express").Router()
const { changeStatus, createRoute, getUserRoute, disableAllUserRoutes, changeRouteStatus, getAllUserRequest, getAllRides, requestAccepted, requestRejected } = require("../controller/driverController")

router.put("/changeStatus/:id", changeStatus)
router.post("/createRoute/:id", createRoute)
router.get("/getUserRoute/:id", getUserRoute)
router.put("/allRoute/disable/:id", disableAllUserRoutes)
router.put("/route/active/:id", changeRouteStatus)
router.put("/request/accepted/:id", requestAccepted)
router.put("/request/rejected/:id", requestRejected)
router.get("/request/getAll/:id", getAllUserRequest)
router.get("/rides/getAll/:id", getAllRides)

module.exports = router