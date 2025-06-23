const Users = require("../model/usersModel")

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

// Crear un nuevo user
const createUser = async (req, res) => {
    try {
        const user = await Users.create(req.body)
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json({message: "Ocurrio un error al crear un user, error: ", error})
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
            where: {username: user}})

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
    getUser,
    getAllUsers,
    createUser,
    deleteUser,
    searchUser
}