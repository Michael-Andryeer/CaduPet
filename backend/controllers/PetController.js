const Pet = require('../models/Pet')

// helpers 
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
// helpers


module.exports = class PetController{

    // create pet
    static async create(request, response){
       
        const {name,age,weigth,color} = request.body

        const available = true

        const images = request.files

        // Checks if images is defined and is an array
        if (!images || !Array.isArray(images) || images.length === 0) {
            response.status(422).json({ message: 'Images are required' });
            return;
        }

        // validations
        if (!name){
            response.status(422).json({ message: 'Name is required' })
            return
        }

        if(!age){
            response.status(422).json({ message: 'Age is required' })
            return
        }

        if(!weigth){
            response.status(422).json({ message: 'Weigth is required' })
            return
        }

        if(!color){
            response.status(422).json({ message: 'Color is required' })
            return
        }

        // validations

        // get pet owner
        const token = getToken(request)
        const user =  await getUserByToken(token)

        //creating a pet 

        const pet = new Pet({name,
            age,
            weigth,
            color,
            available,
            images:[],
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
}