const getToken = require('./getToken')
const getUserByToken = require('./getUserByToken')

const getUserAndToken = async (request) => {
    const token = getToken(request)
    const user = await getUserByToken(token)
    if(!user) {
        return undefined
    }

    return {token, user}
}

module.exports = getUserAndToken
