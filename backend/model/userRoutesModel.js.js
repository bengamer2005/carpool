const { DataTypes } = require("sequelize")
const sequelize = require("../config/connectDB")

const UserRoutes = sequelize.define("UserRoutes", {
    idUserRoutes: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    startingPoint: {
        type: DataTypes.STRING,
    },
    arrivalPoint: {
        type: DataTypes.STRING,
    },
    idStatus: {
        type: DataTypes.BOOLEAN,
        default: true
    },
    startTime: {
        type: DataTypes.TIME
    },
    arrivalTime: {
        type: DataTypes.TIME
    },
    idUsers: {
        type: DataTypes.STRING
    },
    idRouteWay: {
        type: DataTypes.STRING
    },
    routeInfo: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})

module.exports = UserRoutes