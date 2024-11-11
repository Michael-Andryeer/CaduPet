const User = require('../models/User')

module.exports = class UserController {
    static async register(request,response) {
        response.json('Olá cadu!')
    }
}