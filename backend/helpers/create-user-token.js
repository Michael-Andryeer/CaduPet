const jwt = require('jsonwebtoken')

const createUserToken = async(user,request,response) => {
    
    //Create token
    const token = jwt.sign({
        name: user.name,
        id: user._id
    },'mysecret')

    response.status(200).json({
        message: 'You are authenticated',
        token: token,
        userId: user._id
    })
}

module.exports = createUserToken