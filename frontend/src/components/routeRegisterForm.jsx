import { useRef, useEffect } from "react"
import { TileLayer, MapContainer, LayersControl } from "react-leaflet"
// componentes
import AutocompleteInput from "./autocompleteInput"
// servicios
import RouteDriver from "../services/handleRoute"

const RouteForm = ({ startingPoint, setStartingPoint, arrivalPoint, setArrivalPoint, idUsers, geocodeAddress, 
    startTime, setStartTime, arrivalTime, setArrivalTime, handleCreateRoute, handleWaypointChange, maps, idRouteWay, routeInfo, setRouteInfo}) => {
    
    const mapRef = useRef(null)

    return (
        <form onSubmit={handleCreateRoute} style={{ position: "relative" }}>
            {/* campos para la direccion */}
            <div className="input-container">

                {/* se pasan los props para usar los inputs con el autocompletado */}
                <AutocompleteInput
                    // para ida
                    value={startingPoint.address}
                    placeholder="Dirección de salida"
                    onSelect={(value) => setStartingPoint(value)}

                    // para regreso
                    valueReturn={arrivalPoint.address}
                    placeholderReturn="Dirección de entrada"
                    onSelectReturn={(value) => setArrivalPoint(value)}
                />
            </div>

            {/* mapa */}
            <div style={{ position: "relative", zIndex: "1" }}>
                <MapContainer className="map" center={startingPoint.coords} zoom={13} whenCreated={(mapInstance) => { 
                    mapRef.current = mapInstance
                    if(startingPoint.coords) {
                        mapInstance.flyTo(startingPoint.coords, 13)
                    }}}>
                    
                    {/* se pasan como keys las coordenadas de startingPoint y arrivalPoint para que se actualice en el mapa los mark */}
                    <RouteDriver key={`${startingPoint.coords}-${arrivalPoint.coords}`} position="topleft" start={startingPoint.coords} end={arrivalPoint.coords} color="#757de8" onWaypointsChanged={handleWaypointChange}/>
                    <LayersControl position="topright">
                        <LayersControl.BaseLayer checked name="Map">
                            <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url={maps.base} />
                        </LayersControl.BaseLayer>
                    </LayersControl>
                </MapContainer>
            </div>

            {/* campos para las horas de salida y entrada */}
            <div className="input-container2">
                <div className="input">
                    <label style={{color: "#757575"}} htmlFor="horaSalida">Hora de inicio de viaje: </label>
                    <input id="horaSalida" className="input2" type="time" style={{ width: "66%" }} value={startTime}  onChange={(event) => setStartTime(event.target.value)}/>
                </div>
                <div className="input">
                    <label style={{color: "#757575"}}htmlFor="horaEntrada">Hora de llegada: </label>
                    <input id="horaEntrada" className="input2" type="time" value={arrivalTime} onChange={(event) => setArrivalTime(event.target.value)}/>
                </div>
            </div>

            {/* campo para comentarios */}
            <div className="center">
                <textarea maxLength={255} className="input4" placeholder="Informacion adicional para la ruta . . ." value={routeInfo} onChange={(event) => setRouteInfo(event.target.value)}></textarea>
            </div>

            {/* boton para submit */}
            <div className="button-container" style={{ display: "flex", justifyContent: "flex-end", marginLeft: "-10.3%" }}>
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