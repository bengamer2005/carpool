import { useEffect, useState } from "react"
import { autocompleteAddress } from "../services/handleDirection"

const AutocompleteInput = ({ value, onSelect, placeholder, valueReturn, onSelectReturn, placeholderReturn }) => {
    // logica del autocomplete para el campo de ida  
    const [input, setInput] = useState(value || "")
    const [suggest, setSuggest] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)

    // compara value con input, si son diferentes lo actualiza en el input, se usa setShowDropdown para no mostrar las sugerencias 
    useEffect(() => {
        if(value !== input) {
            setInput(value || "")
            setShowDropdown(false)
        }
    }, [value])

    // para mostrar las sugerencias
    useEffect(() => {
        const timeout = setTimeout(() => {
            
            // cuando el input supera los 4 caracteres muestra las sugerencias en base al input
            if(input.length >= 5) {
                autocompleteAddress(input)
                    .then(setSuggest)

                    // si sale mal mostramos en consola el error
                    .catch(console.error())
            } else {
                // si no supera los 4 caracteres no devuelve nada
                setSuggest([])
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [input])

    const handleSelect = (place) => {

        // se guardan los datos (LatLon, direccion) de la ruta seleccionada 
        const selected = {
            coords: [parseFloat(place.lat), parseFloat(place.lon)],
            address: place.display_name
        }

        // se pasan las variables a los estados
        setInput(place.display_name)
        setSuggest([])
        onSelect(selected)
        setShowDropdown(false)
    }

    // logica del autocomplete para el campo de regreso  
    const [inputReturn, setInputReturn] = useState(valueReturn || "")
    const [suggestReturn, setSuggestReturn] = useState([])
    const [showDropdownReturn, setShowDropdownReturn] = useState(false)

    // compara value con input, si son diferentes lo actualiza en el input, se usa setShowDropdown para no mostrar las sugerencias
    useEffect(() => {
        if(valueReturn !== inputReturn) {
            setInputReturn(valueReturn || "")
            setShowDropdownReturn(false)
        }
    }, [valueReturn])

    // para mostrar las sugerencias
    useEffect(() => {
        const timeout = setTimeout(() => {

            // cuando el input supera los 4 caracteres muestra las sugerencias en base al input
            if(inputReturn.length >= 5) {
                autocompleteAddress(inputReturn)
                    .then(setSuggestReturn)

                    // si sale mal mostramos en consola el error
                    .catch(console.error())
            } else {
                // si no supera los 4 caracteres no devuelve nada
                setSuggestReturn([])
            }
        }, 300)

        return () => clearTimeout(timeout)
    }, [inputReturn])

    const handleSelectReturn = (place) => {
        // se guardan los datos (LatLon, direccion) de la ruta seleccionada 
        const selected = {
            coords: [parseFloat(place.lat), parseFloat(place.lon)],
            address: place.display_name
        }

        // se pasan las variables a los estados
        setInputReturn(place.display_name)
        setSuggestReturn([])
        onSelectReturn(selected)
        setShowDropdownReturn(false)
    }

    return (
        <>
            <input className="input" type="text" value={input} placeholder={placeholder} onFocus={() => setShowDropdown(true)} onBlur={() => setTimeout(() => setShowDropdown(false), 200)} onChange={(event) => setInput(event.target.value)}/>

            {/* mostramos las sugerencias para las de ida */}
            {showDropdown && suggest.length > 0 && (
                <ul style={{ position: "absolute", width: "39.2%", marginRight: "40.7%", zIndex: "10", background: "#fff", listStyle: "none", padding: "0", marginTop: "45px", border: "1px solid #ccc", maxHeight: "200px", overflowY: "auto" }}>
                    {suggest.map((place, i) => (
                        <li key={i} onClick={() => handleSelect(place)} style={{ padding: "8px", cursor: "pointer" }}>
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}

            <input className="input" type="text" value={inputReturn} placeholder={placeholderReturn} onFocus={() => setShowDropdownReturn(true)} onBlur={() => setTimeout(() => setShowDropdownReturn(false), 200)} onChange={(event) => setInputReturn(event.target.value)}/>
            
            {/* mostramos las sugerencias para las de ida */}
            {showDropdownReturn && suggestReturn.length > 0 && (
                <ul style={{ position: "absolute", width: "39.2%", marginLeft: "40.7%", zIndex: "10", background: "#fff", listStyle: "none", padding: "0", marginTop: "45px", border: "1px solid #ccc", maxHeight: "200px", overflowY: "auto" }}>
                    {suggestReturn.map((place, i) => (
                        <li key={i} onClick={() => handleSelectReturn(place)} style={{ padding: "8px", cursor: "pointer" }}>
                            {place.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default AutocompleteInput