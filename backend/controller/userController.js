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

        // si ya existe un usuario con mismo correo lanzamos error
        const findEmail = await Users.findOne({
            where: { email }
        })
        
        if(findEmail) {
            return res.status(401).json({message: "Email ya registrado, favor de iniciar sesion"})
        }

        // hashear contraseña
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // se hace el post del usuario
        const user = await Users.create({ name, username, idRole, email, password: hashedPassword })

        // extrameos toda la info del usuario
        const userInfo = await Users.findOne({
            where: { email: email, username: username }
        })
        
        // generamos el token
        const token = jwt.sign({
            id: userInfo.idUsers, 
            email: userInfo.email,
            role: userInfo.idRole
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        const { password: _, ...userData } = userInfo.dataValues

        res.status(200).json({user, token, userInfo: userData})

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
        const emailUser = email.trim().toLowerCase()
        const user = await Users.findOne({
            where: { email: emailUser }
        })

        if(!user) {
            return res.status(404).json({message: "Favor de registrarse"})
        }

        // verificamos la contraseña
        const comparePassword = await bcrypt.compare(password, user.password)
        
        if(!comparePassword) {
            return res.status(401).json({message: "Credenciales invalidas"})
        }

        // generamos el token
        const token = jwt.sign({
            id: user.idUsers, 
            email: user.email,
            role: user.idRole
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        })

        const { password: _, ...userData } = user.dataValues

        res.status(200).json({message: "Login exitoso: ", token, user: userData})
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error en el login: ", error: error.message})
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

module.exports = {
    registerUser,
    loginUser,
    getUser,
    getAllUsers
}