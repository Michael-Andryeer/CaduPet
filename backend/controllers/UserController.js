// Imports
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// Imports

// helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
// helpers

module.exports = class UserController {
    static async register(request, response) {
        const { name, email, phone, password, confirmpassword } = request.body
        
        if (!name) {
            response.status(422).json({ message: 'Name is required' })
            return
        }

        if (!email) {
            response.status(422).json({ message: 'Email is required' })
            return
        }

        if (!phone) {
            response.status(422).json({ message: 'Phone number is required' })
            return
        }

        if (!password) {
            response.status(422).json({ message: 'Password is required' })
            return
        }

        if (!confirmpassword) {
            response.status(422).json({ message: 'Password confirmation is required' })
            return
        }

        if (confirmpassword !== password) {
            response.status(422).json({
                message: 'Passwords must match!'
            })
            return
        }

        // check if user exists
        const userExists = await User.findOne({ email: email })

        if (userExists) {
            response.status(422).json({
                message: 'This email is already registered. Please use another one!'
            })
            return
        }

        // create password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create a user
        const user = new User({
            name: name,
            email: email,
            phone: phone,
            password: passwordHash,
        })

        try {
            const newUser = await user.save()
            await createUserToken(newUser, request, response)
        } catch (error) {
            response.status(500).json({ message: error })
        }
    }

    static async login(request, response) {
        const { email, password } = request.body

        if (!email) {
            response.status(422).json({ message: 'Email is required' })
            return
        }

        if (!password) {
            response.status(422).json({ message: 'Password is required' })
            return
        }

        // check if user exists
        const user = await User.findOne({ email: email })

        if (!user) {
            response.status(422).json({
                message: 'No user registered with this email'
            })
            return
        }

        // check if the password matches the one in the database
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            response.status(422).json({
                message: 'Invalid password'
            })
            return
        }

        await createUserToken(user, request, response)
    }

    static async checkUser(request, response) {
        let currentUser;

        if (request.headers.authorization) {
            const token = getToken(request);
            const decoded = jwt.verify(token, 'nossosecret');

            currentUser = await User.findById(decoded.id).select('-password');
        } else {
            currentUser = null;
        }

        response.status(200).send(currentUser);
    }

    static async getUserById(request, response) {
        const id = request.params.id

        try {
            const user = await User.findById(id).select('-password')

            response.status(200).json({ user })
        } catch (error) {
            return response.status(422).json({ message: 'User not found!' })
        }
    }

    static async editUser(request, response) {
        const token = getToken(request)

        const user = await getUserByToken(token)

        const name = request.body.name
        const email = request.body.email
        const phone = request.body.phone
        const password = request.body.password
        const confirmpassword = request.body.confirmpassword

        if(request.file){
            user.image = request.file.filename
        }

        if (request.file) {
            user.image = request.file.filename
        }

        // validations
        if (!name) {
            return response.status(422).json({ message: 'Name is required!' })
        }

        user.name = name

        if (!email) {
            return response.status(422).json({ message: 'Email is required!' })
        }

        // check if user exists
        const userExists = await User.findOne({ email: email })

        if (user.email !== email && userExists) {
            return response.status(422).json({ message: 'Please use another email!' })
        }

        user.email = email

        if (!phone) {
            return response.status(422).json({ message: 'Phone is required!' })
        }

        user.phone = phone

        // check if password matches
        if (password && password !== confirmpassword) {
            return response.status(422).json({ error: 'Passwords do not match.' })
        } else if (password === confirmpassword && password != null) {
            // creating password
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            // returns updated data
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true },
            )
            return response.json({
                message: 'User updated successfully!',
                data: updatedUser,
            })
        } catch (error) {
            return response.status(500).json({ message: error })
        }
    }
}