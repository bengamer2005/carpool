import { motion } from "framer-motion"
import { useState } from "react"
import DriverRequests from "../hooks/getAllRequests"
import GetAllRides from "../hooks/getAllRides"
import { CardAcceptedReq } from "../components/cards"

const Prueba = () => {
  const [activeSection, setActiveSection] = useState("A")

  return (
    <div >
      
      <CardAcceptedReq/>
    </div>
  )
}

export default Prueba