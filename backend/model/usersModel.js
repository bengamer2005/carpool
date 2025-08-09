const { DataTypes } = require("sequelize")
const sequelize = require("../config/connectDB")

const Users = sequelize.define("Users", {
    idUsers: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    idRole: {
        type: DataTypes.INTEGER
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false
})

module.exports = Users  