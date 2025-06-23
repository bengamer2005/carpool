import L from "leaflet"
import { createControlComponent } from "@react-leaflet/core"
import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"

const Route = ({ position, start, end, color, onWaypointsChanged }) => {
  const control = L.Routing.control({
    position,
    waypoints: [L.latLng(...start), L.latLng(...end)],
    lineOptions: {
      styles: [{ color, weight: 4 }],
    },
    routeWhileDragging: true,
    draggableWaypoints: true,
    addWaypoints: true,
    show: false,

    createMarker: function (i, wp, nWps) {
      if (i === 0) {
        return L.marker(wp.latLng, {
          icon: L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
          draggable: true,
        })
      } else {
        return L.marker(wp.latLng, {
          icon: L.divIcon({
            className: "",
            html: `
              <div style="
                background: white;
                border: 2px solidrgb(86, 141, 252);
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 4px rgba(0,0,0,0.3);
              ">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#ff6600" viewBox="0 0 16 16">
                  <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
                </svg>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          }),
          draggable: true,
        })
      }
    }
  })

  control.on("waypointschanged", function (event) {
    const waypoints = event.waypoints.map(wp => wp.latLng)
    if (onWaypointsChanged) {
      onWaypointsChanged(waypoints)
    }
  })

  return control
}

const RouteDriver = createControlComponent(Route)

export default RouteDriver