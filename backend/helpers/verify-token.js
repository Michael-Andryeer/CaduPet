const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

// Middleware to verify JWT token
const checkToken = (request,response,next) => {

    if (!request.headers.authorization) {
        return response.status(401).json({ message: "Unauthorized" })
    }

    const token = getToken(request)

    if(!token) {
        return response.status(401).json({ message: "Unauthorized" })
    }

    try{
        const verified = jwt.verify(token,'mysecret')
        request.user = verified
        next()
    } catch(err) {
        return response.status(400).json({message: 'Invalid Token'})
    }
}

module.exports = checkToken