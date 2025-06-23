const router = require("express").Router()
const { changeStatus, createRoute, getUserRoute, disableAllUserRoutes, changeRouteStatus, changeRouteStatusDisable } = require("../controller/driverController")

router.put("/changeStatus", changeStatus)
router.post("/createRoute", createRoute)
router.get("/getUserRoute", getUserRoute)
router.put("/allRoute/disable", disableAllUserRoutes)
router.put("/route/active/:id", changeRouteStatus)
// router.put("/route/disable", changeRouteStatusDisable)

module.exports = router