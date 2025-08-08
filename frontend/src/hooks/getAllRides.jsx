// componentes
import { CardRides } from "../components/cards"

const GetAllRides = ({ rides }) => {

    // le damos un formato a la hora
    const time = (timeString) => {
        const date = new Date(timeString)
        const hour = date.getUTCHours().toString().padStart(2, '0')
        const min = date.getUTCMinutes().toString().padStart(2, '0')

        return `${hour}:${min}`
    }

    // se crea un array con los dias que usaremos en la columnas
    const orderDays = ["lunes", "martes", "miércoles", "jueves", "viernes"]
    
    return (
        <>
            <h2 className="title-white-reverse">MIS VIAJES PENDIENTES</h2>
            
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-start", flexWrap: "wrap", gap: "20px", padding: "20px", paddingLeft: "10%", paddingRight: "10%"}}>
                {orderDays.map((day) => (
                    <div key={day} style={{ display: "grid", justifyContent: "center", alignItems: "center", minWidth: "200px", flex: "1" }}>
                        
                        {/* titulo para cada columna con el dia */}
                        <hr style={{ border: "none", borderTop: "2px solid #ccc", width: "100%", marginBottom: "-15px" }}/>
                        <h3 className="rides-days">{day}</h3>
                        <hr style={{ border: "none", borderTop: "2px solid #ccc", width: "100%", marginTop: "-10px", paddingBottom: "20px" }}/>

                        {/* ordenamos todas los viajes por dia y por columna */}
                        {rides[day]?.length > 0 ? (

                            // si tenemos datos los llenamos con CardRides
                            rides[day].map(ride => (
                                <CardRides
                                key={ride.idReq}
                                username={ride.solicitante}
                                idRoute={ride.idRutaDelViaje}
                                dayRequest={ride.fechaSolicitada}
                                startTime={time(ride.horaSalida)}
                                arrivalTime={time(ride.horaLlegada)}
                                routeWay={ride.tipoRuta}
                                />
                            ))

                        ) : (

                            // si no tenenmos info para el dia se le da feedback al usuario 
                            <p style={{ textAlign: "center", fontStyle: "italic", color: "#aaa", width: "200px", height: "200px"}}>Sin viajes</p> 
                        )}
                    </div>
                ))}
            </div>
        </>
    )
}

export default GetAllRides