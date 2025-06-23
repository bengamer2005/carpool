const router = require("express").Router()
const { getAllGoingRoute, getAllReturnRoute, changeStatus } = require("../controller/passengerController")

router.get("/route/going", getAllGoingRoute)
router.get("/route/return", getAllReturnRoute)
router.put("/changeStatus", changeStatus)

module.exports = router