const getToken = (request) => {
    const auth = request.headers.authorization
    const token = auth.split(" ")[1]
    return token
}

module.exports = getToken
