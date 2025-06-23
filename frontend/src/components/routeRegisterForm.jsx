import { TileLayer, MapContainer, LayersControl } from "react-leaflet"
// servicios
import RouteDriver from "../services/handleRoute"

const RouteForm = ({ startingPoint, setStartingPoint, arrivalPoint, setArrivalPoint, idUsers, geocodeAddress, 
    startTime, setStartTime, arrivalTime, setArrivalTime, handleCreateRoute, handleWaypointChange, maps, idRouteWay, routeInfo, setRouteInfo}) => {
    
    return (
        <form onSubmit={handleCreateRoute(idRouteWay)}>
            <div className="input-container">
                <input className="input" value={startingPoint.address} onChange={(e) => setStartingPoint({ ...startingPoint, address: e.target.value })} onBlur={async () => {
                    const result = await geocodeAddress(startingPoint.address)
                    if (result) {
                        setStartingPoint({ coords: [result.lat, result.lon], address: result.display_name })
                    }
                }}
                placeholder="Dirección de salida"/>

                <input className="input" value={arrivalPoint.address} onChange={(e) => setArrivalPoint({ ...arrivalPoint, address: e.target.value })} onBlur={async () => {
                    const result = await geocodeAddress(arrivalPoint.address)
                    if (result) {
                        setArrivalPoint({ coords: [result.lat, result.lon], address: result.display_name })
                    }
                }}
                placeholder="Dirección de llegada"/>

                <input type="hidden" value={idUsers}/>
                <input type="hidden" value={idRouteWay}/>
            </div>

            {/* MAPA */}
            <MapContainer className="map" center={startingPoint.coords} zoom={13}>
                <RouteDriver position="topleft" start={startingPoint.coords} end={arrivalPoint.coords} color="#757de8" onWaypointsChanged={handleWaypointChange}/>
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Map">
                        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url={maps.base} />
                    </LayersControl.BaseLayer>
                </LayersControl>
            </MapContainer>

            <div className="input-container2">
                <div className="input">
                    <label style={{color: "#757575"}} htmlFor="horaSalida">Hora de salida: </label>
                    <input id="horaSalida" className="input2" type="time" value={startTime}  onChange={(event) => setStartTime(event.target.value)}/>
                </div>
                <div className="input">
                    <label style={{color: "#757575"}}htmlFor="horaEntrada">Hora de entrada: </label>
                    <input id="horaEntrada" className="input2" type="time" value={arrivalTime} onChange={(event) => setArrivalTime(event.target.value)}/>
                </div>
            </div>

            <div className="center">
                <textarea maxLength={255} className="input4" placeholder="Informacion adicional para la ruta . . ." value={routeInfo} onChange={(event) => setRouteInfo(event.target.value)}></textarea>
            </div>

            <div className="button-container">
                <div className="input3" type="hidden"></div>
                <button className="button" type="submit">
                    <span className="button__text">AGREGAR RUTA</span>
                    <span className="button__icon">
                        <svg className="svg" fill="none" height="24" stroke="currentColor" strokeLinecap="round" 
                            strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="500" 
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="12" x2="12" y1="5" y2="19"></line>
                            <line x1="5" x2="19" y1="12" y2="12"></line>
                        </svg>
                    </span>
                </button>
            </div>
        </form>
    )
}

export default RouteForm