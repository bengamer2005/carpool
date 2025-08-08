// commponentes
import { CardRequest } from "../components/cards"
// img
import noSolicitudes from "../img/noSolicitudesFeedBack.png"

const DriverRequests = ({ requests }) => {

    // en caso de que no hayan datos se le da feedback al usuario
    if(requests.length === 0) {
        return (
            <>
                <h2 className="title-white">MIS SOLICITUDES PENDIENTES</h2>
                <div className="feedback-wrapper">
                    <div className="image-feedback">
                        <img src={noSolicitudes} alt="no solicitudes pendientes feed back"/>
                    </div>
                    <h2 className="feedback-message">No hay solicitudes pendientes por aquí</h2>
                </div>
            </>
        )
    }

    return (
        <>
            <h2 className="title-white">MIS SOLICITUDES PENDIENTES</h2>
            
            {/* mapeamos el contenido con CardRequest */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", alignItems: "center", marginLeft: "5%", marginRight: "5%" }}>
                {requests.map((req) => (
                    <CardRequest
                    key={req.idReq}
                    username={req.reqOwner}
                    idReq={req.idReq}
                    idRoute={req.idRoute}
                    dayRequest={req.dayReq}/>
                ))}
            </div>
        </>
    )
}

export default DriverRequests