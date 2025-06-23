import React from "react"
import RegisterPage from "./pages/registerPage"
import Driver from "./pages/driverPage"
import Passenger from "./pages/passengerPage"
import Prueba from "./pages/PRUEBAS"
import { BrowserRouter, Route, Routes } from "react-router"
// ESTILOS
import "../src/styles/passengerPage.css"
import "../src/styles/forms.css"
import "../src/styles/header.css"
import "../src/styles/driverPage.css"
import "../src/styles/registerPage.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegisterPage/>}/>
        <Route path="/conductor" element={<Driver/>}/>
        <Route path="/pasajero" element={<Passenger/>}/>
        <Route path="/pruebas" element={<Prueba/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App