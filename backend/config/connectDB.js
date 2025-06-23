const { Sequelize } = require("sequelize")

const DB = new Sequelize("CARPOOL", "sa", "Grupogp2015", {
    host: "192.168.10.74",
    dialect: "mssql",
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true,
        }
    },
    port: 1433
})

module.exports = DB