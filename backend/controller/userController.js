const { mapWhereFieldNames } = require("sequelize/lib/utils")
const Users = require("../model/usersModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// registro de un usuario
const registerUser = async (req, res) => {
    try {
        const { name, username, idRole, email, password } = req.body

        // si no cuenta con todos los campos lanzamos error
        if(!name || !username || !idRole || !email || !password) {
            return res.status(400).json({message: "Faltan campos por llenar"})
        }

        // hashear contraseña
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await Users.create({ name, username, idRole, email, password: hashedPassword })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al registrar, error: ", error})
    }
}

// login de un usuario
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        // si no completa todos los campos lanzamos error
        if(!email || !password) {
            return res.status(400).json({message: "Faltan campos por llenar"})
        }

        // buscamos si existe el user
        const user = await Users.findOne({
            where: { email }
        })

        if(!user) {
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        // verificamos la contraseña
        const comparePassword = await bcrypt.compare(password, user.password)
        
        if(!comparePassword) {
            return res.status(401).json({message: "Contraseña incorrecta"})
        }

        // generamos el token
        const token = jwt.sign({
            id: user.idUsers, 
            email: user.email,
            role: user.idRole
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        res.status(200).json({message: "Login exitoso: ", token})
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error en el login: ", error})
    }
}

// Obtiene la info del user en pantalla 
const getActualUser = async (req, res) => {
    try {
        const USER = process.env.USERNAME
        const user = await Users.findOne({
            where: { username: USER }
        })

        if(!user) {
            res.status(404).json({message: "Usuario aun no registrado"})
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Llamar a un user en especifico
const getUser = async (req, res) => {
    try {
        const user = await Users.findByPk(req.params.id)
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al llamar al user, error: ", error})  
    }
}

// Llamar a todos los users
const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll({})
        res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al llamar a todos los users. error: ", error})
    }
}


// Eliminar a un user
const deleteUser = async (req, res) => {
    try {
        const user = await Users.destroy({
            where: { idUsers: req.params.id }
        })
        
        if(!user) {
            return res.status(404).json({message: `No se encontro al user con id: ${req.params.id}`})
        }

        res.status(200).json({message: `Se elimino al user con id: ${req.params.id}`})  
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al eliminar un user, error: ", error})        
    }
}

// Buscar user con el user de windows
const searchUser = async (req, res) => {
    try {
        const user = process.env.USERNAME
        
        const search = await Users.findOne({
            where: {username: user}
        })

        if (search.username === user) {
            return res.status(200).json({ userNotFound: false, idRole: search.idRole, idUsers: search.idUsers })
        }

        console.log(search)
        return res.status(200).json({ userNotFound: true })
    } catch (error) {
        res.status(500).json({message: `Ocurrió un error al buscar el user: ${error.message}`})
    }
}

module.exports = {
    registerUser,
    loginUser,
    getActualUser,
    getUser,
    getAllUsers,
    deleteUser,
    searchUser
}