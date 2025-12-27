const { DataTypes } = require("sequelize")
const sequelize = require("../config/connectDB")

const Request = sequelize.define("Request", {
    idRequest: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idUserReq: {
        type: DataTypes.INTEGER
    },
    idRoute: {
        type: DataTypes.INTEGER
    },
    idStatusReq: {
        type: DataTypes.INTEGER
    },
    dateRegister: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    dayRequest: {
        type: DataTypes.DATE
    },
    confirmation: {
        type: DataTypes.INTEGER
    }
}, {
    timestamps: false
})

module.exports = Request  