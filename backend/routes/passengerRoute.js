const router = require("express").Router()
const { getAllGoingRoute, getAllReturnRoute, changeStatus, sendRequest, getRequest, getAcceptedRequest } = require("../controller/passengerController")

router.get("/route/going/:id", getAllGoingRoute)
router.get("/route/return/:id", getAllReturnRoute)
router.put("/changeStatus/:id", changeStatus)
router.post("/sendRequest/:id", sendRequest)
router.get("/request/:id", getRequest)
router.get("/allRequest/accepted/:id", getAcceptedRequest)

module.exports = router