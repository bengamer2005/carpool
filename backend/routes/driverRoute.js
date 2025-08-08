const router = require("express").Router()
const { changeStatus, createRoute, getUserRoute, disableAllUserRoutes, changeRouteStatus, getAllUserRequest, getAllRides, requestAccepted, requestRejected } = require("../controller/driverController")

router.put("/changeStatus", changeStatus)
router.post("/createRoute", createRoute)
router.get("/getUserRoute", getUserRoute)
router.put("/allRoute/disable", disableAllUserRoutes)
router.put("/route/active/:id", changeRouteStatus)
router.put("/request/accepted/:id", requestAccepted)
router.put("/request/rejected/:id", requestRejected)
router.get("/request/getAll", getAllUserRequest)
router.get("/rides/getAll", getAllRides)

module.exports = router