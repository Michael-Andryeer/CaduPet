// Importações
const User = require('../models/User');
const bcrypt = require('bcrypt');
const createUserToken = require('../helpers/create-user-token');
// Importações

module.exports = class UserController {
    static async register(request, response) {
        const { name, email, phone, password, confirmPassword } = request.body;

        // Execute validations
        const errors = UserController.validateFields({ name, email, phone, password, confirmPassword });
        if (errors.length > 0) {
            return response.status(400).json({ errors });
        }

        try {
            // Check if user already exists based on email
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return response.status(400).json({ message: 'User with this email already exists' });
            }
        } catch (error) {
            return response.status(500).json({ message: 'An error occurred while checking user existence', error });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            phone,
            password: hashPassword // Pass the encrypted password when registering the user
        });

        try {
            const newUser = await user.save();
            await createUserToken(newUser, request, response);
        } catch (error) {
            response.status(500).json({ message: error });
        }
    } 

    static validateFields(fields) {
        const errors = [];
        const { name, email, phone, password, confirmPassword } = fields;

        if (!name) errors.push({ field: 'name', message: 'Name is required' });
        if (!email) errors.push({ field: 'email', message: 'Email is required' });
        if (!phone) errors.push({ field: 'phone', message: 'Phone is required' });
        if (!password) errors.push({ field: 'password', message: 'Password is required' });
        if (!confirmPassword) errors.push({ field: 'confirmPassword', message: 'ConfirmPassword is required' });
        
        // Check if password and confirmPassword match
        if (password && confirmPassword && password !== confirmPassword) {
            errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
        }
        return errors;
    }
};
