const router = require("express").Router()
const { getAllGoingRoute, getAllReturnRoute, changeStatus, sendRequest, getRequest, getAcceptedRequest } = require("../controller/passengerController")

router.get("/route/going", getAllGoingRoute)
router.get("/route/return", getAllReturnRoute)
router.put("/changeStatus", changeStatus)
router.post("/sendRequest/:id", sendRequest)
router.get("/request/:id", getRequest)
router.get("/allRequest/accepted", getAcceptedRequest)

module.exports = router