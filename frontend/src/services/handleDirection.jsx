const API_KEY = "pk.9dd21025f4f5aa205460a6298c96f50f"

// pasar las LatLon a una direccion legible 
export const reverseGeocode = async (lat, lon) => {
    const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${lat}&lon=${lon}&format=json`)
    const data = await response.json()
    return data.display_name || `${lat}, ${lon}`
}

// pasamos una direccion a LatLon para poder seleccionar desde el mapa y mostrar la direccion
export const geocodeAddress = async (address) => {
    const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`)
    const data = await response.json()
    if(data.length > 0) {
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            display_name: data[0].display_name
        }
    }
}

// autocompletado de direcciones para el form
export const autocompleteAddress = async (address) => {
    const response = await fetch(`https://us1.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`)
    const data = await response.json()
    return data
}