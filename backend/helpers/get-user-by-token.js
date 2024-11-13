const jwt = require('jsonwebtoken')
const User = require('../models/User')

// get user by jwt token
const getUserByToken = async (token) => {

    if(!token){
        return response.status(401).json({message: 'Unauthorized'})
    }
    const decoded = jwt.verify(token,'mysecret')

    const userId = decoded.id

    const user = await User.findOne({_id: userId})

    return user
}
module.exports = getUserByToken