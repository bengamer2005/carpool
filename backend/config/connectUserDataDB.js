const { Sequelize } = require("sequelize")

const UsersDB = new Sequelize("GrupoGP", "sa", "F0rT1@.db", {
    host: "192.168.10.54",
    dialect: "mssql",
    dialectOptions: {
        options: {
            encrypt: false,
            trustServerCertificate: true,
        }
    },
    port: 1433
})

module.exports = UsersDB