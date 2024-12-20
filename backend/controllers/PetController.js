const Pet = require('../models/Pet')

// helpers 
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const objectId = require('mongoose').Types.ObjectId
// helpers

module.exports = class PetController {

    // create pet
    static async create(request, response) {
       
        const {name, age, weight, color} = request.body

        const available = true

        const images = request.files

        // Checks if images is defined and is an array
        if (!images || !Array.isArray(images) || images.length === 0) {
            response.status(422).json({ message: 'Images are required' });
            return;
        }

        // validations
        if (!name) {
            response.status(422).json({ message: 'Name is required' })
            return
        }

        if (!age) {
            response.status(422).json({ message: 'Age is required' })
            return
        }

        if (!weight) {
            response.status(422).json({ message: 'Weight is required' })
            return
        }

        if (!color) {
            response.status(422).json({ message: 'Color is required' })
            return
        }

        // validations

        // get pet owner
        const token = getToken(request)
        const user = await getUserByToken(token)

        //creating a pet 

        const pet = new Pet({
            name,
            age,
            weight,
            color,
            available,
            images: [],
            user: {
                _id: user._id,
                name: user.name,
                image: user.image,
                phone: user.phone
            },
        })

        images.map((image) => {
            pet.images.push(image.filename)
        })  

        try {
            const newPet = await pet.save()
            response.status(201).json({
                message: 'Pet created successfully',
                newPet
            })
        } catch (error) {
            response.status(500).json({message: error})
        }
    }

    static async getAll(request, response) {

        // Ordena pelos mais novos inseridos
        const pets = await Pet.find().sort('-createAt')

        response.status(200).json({
            pets: pets,
        })
    }

    static async getAllUsersPets(request, response) {

        // get user from token
        const token = getToken(request)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'user._id': user._id}).sort('-createdAt')

        response.status(200).json({
             pets,
        })
    }

    static async getAllUserAdoptions(request, response) {

        // get user from token
        const token = getToken(request)
        const user = await getUserByToken(token)

        const pets = await Pet.find({'adopter._id': user._id}).sort('-createdAt')

        response.status(200).json({
            pets,
        })
    }

    static async getPetById(request, response) {
        const id = request.params.id

        if (!objectId.isValid(id)) {
            response.status(422).json({ message: 'Invalid id' })
            return
        }

        // check if pet exists
        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            response.status(404).json({ message: 'Pet not found!' })
            return
        }

        response.status(200).json({
            pet: pet,
        })
    }

    static async removePetById(request, response) {

        const id = request.params.id

        // check if Id is valid
        if (!objectId.isValid(id)) {
            response.status(422).json({ message: 'Invalid id' })
            return
        }

        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            response.status(404).json({ message: 'Pet not found!' })
            return
        }

        // Check if the logged-in user has registered the pet, to prevent a user from removing another user's pet
        const token = getToken(request)
        const user = await getUserByToken(token)


        if (pet.user._id.toString() !== user._id.toString()) {
            response.status(422).json({
                message: 'You are not authorized to remove this pet'
            })
            return
        }
        await Pet.findByIdAndDelete(id)
        response.status(200).json({ message: 'Pet removed successfully' })
    }

    static async updatePetById(request, response) {

        const id = request.params.id

        const {name, age, weight, color, available} = request.body

        const images = request.files

        // The pet's data will be saved here
        const updatedData = {}

        const pet = await Pet.findOne({_id: id})
        if (!pet) {
            response.status(404).json({ message: 'Pet not found!' })
            return
        }
        
        const token = getToken(request)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            response.status(422).json({
                message: 'You are not authorized to update this pet'
            })
            return
        }

        //validations
        if (!name) {
            response.status(422).json({ message: 'Name is required' })
            return
        } else {
            updatedData.name = name
        }

        if (!color) {
            response.status(422).json({ message: 'Color is required' })
            return
        } else {
            updatedData.color = color
        }

        if (!age) {
            response.status(422).json({ message: 'Age is required' })
            return
        } else {
            updatedData.age = age
        }

        if (!weight) {
            response.status(422).json({ message: 'Weight is required' })
            return
        } else {
            updatedData.weight = weight
        }

        // Checks if images is defined and is an array
        if (!images || !Array.isArray(images) || images.length === 0) {
            response.status(422).json({ message: 'Images are required' });
            return;
        } else {
            updatedData.images = []
            images.map((image) => {
                updatedData.images.push(image.filename)
            })
        }
        await Pet.findByIdAndUpdate(id, updatedData)

        response.status(200).json({
            message: 'Pet updated successfully',
        })
    }

    static async schedule(request, response) {
        const id = request.params.id
    
        // Check if id is a valid ObjectId
        if (!objectId.isValid(id)) {
            return response.status(422).json({ message: 'Invalid pet ID' })
        }
    
        //check if pet exists
        const pet = await Pet.findOne({_id: id})
    
        if (!pet) {
            return response.status(404).json({ message: 'Pet not found!' })
        }
    
        // check if user registered the pet
        const token = getToken(request)
        const user = await getUserByToken(token)
    
        if (pet.user._id.equals(user._id)) {
            return response.status(422).json({ message: 'You cannot schedule an appointment for your own pet!' })
        }
    
        // check if user has already scheduled a visit
        if (pet.adopter) {
            if (pet.adopter._id.equals(user._id)) {
                return response.status(422).json({ message: 'You have already scheduled an appointment for this pet!' })
            } else {
                return response.status(422).json({ message: 'This pet has already been scheduled for a visit by another user!' })
            }
        }
    
        // add user to pet
        pet.adopter = {
            _id: user._id,
            name: user.name,
            image: user.image,
            phone: user.phone
        }
    
        try {
            await Pet.findByIdAndUpdate(id, pet)
            
            return response.status(200).json({
                message: `The visit has been successfully scheduled, please contact ${pet.user.name} at ${pet.user.phone}`
            })
        } catch (error) {
            console.error('Error scheduling visit:', error)
            return response.status(500).json({ message: 'An error occurred while scheduling the visit' })
        }
    }

    static async concludedAdoption(request, response) {
        const id = request.params.id

        const pet = await Pet.findOne({_id: id})

        if (!pet) {
            response.status(404).json({ message: 'Pet not found!' })
            return
        }

        const token = getToken(request)
        const user = await getUserByToken(token)

        if (pet.user._id.toString() !== user._id.toString()) {
            response.status(422).json({ message: 'You are not authorized to conclude this adoption' })
            return
        }
        

        pet.available = false

        await Pet.findByIdAndUpdate(id, pet)

        response.status(200).json({
            message: 'Adoption concluded successfully',
        })
    }
}