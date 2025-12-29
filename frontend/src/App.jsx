import { BrowserRouter, Route, Routes } from "react-router"
// importamos todas las paginas
import RegisterPage from "./pages/registerPage"
import Driver from "./pages/driverPage"
import Passenger from "./pages/passengerPage"
// estilos
import "../src/styles/passengerPage.css"
import "../src/styles/forms.css"
import "../src/styles/header.css"
import "../src/styles/driverPage.css"
import "../src/styles/registerPage.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* le asignamos una ruta a cada pagina */}
        <Route path="/" element={<RegisterPage/>}/>
        <Route path="/conductor" element={<Driver/>}/>
        <Route path="/pasajero" element={<Passenger/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App