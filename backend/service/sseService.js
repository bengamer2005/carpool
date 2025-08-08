const users = []

// para añadir a un usuario conectado
const addClient = (userId, res) => {
    users.push({ userId, res })
}

// para quitar a un usuario cuando se desconecta
const removeClient = (res) => {
    const index = users.findIndex(user => user.res === res)

    if(index !== -1) {
        users.splice(index, 1)
    }
}

// para mandar los eventos a un usuario en especifico
const sendEventToUser = ( targetUserId, data ) => {
    users
        .filter(user => user.userId === targetUserId)
        .forEach(user => user.res.write(`data: ${JSON.stringify(data)}\n\n`))
}

module.exports = {
    addClient, removeClient, sendEventToUser
}