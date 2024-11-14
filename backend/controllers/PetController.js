const Pet = require('../models/Pet')

module.exports = class PetController{

    // create pet
    static async create(request, response){
        response.json({message: "test"})
    }
}