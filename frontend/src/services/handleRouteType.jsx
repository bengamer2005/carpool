import React from "react"

export const getGoingRoutes = async () => {
    const response = await fetch("http://localhost:3000/carpool/passenger/route/going")
    const data = await response.json()
    return data[0]
}

export const getReturnRoutes = async () => {
    const response = await fetch("http://localhost:3000/carpool/passenger/route/return")
    const data = await response.json()
    return data[0]
}