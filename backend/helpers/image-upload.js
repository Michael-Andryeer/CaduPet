const multer = require('multer') // Multer is a Node.js middleware for handling multipart/form-data, primarily used for uploading files.
const path = require('path') 

// Destination to store the images
const imageStorage = multer.diskStorage({
    destination: function(request, file, callback) {
        let folder = '' // Initializes an empty folder variable

        if (request.baseUrl.includes("users")) {
            folder = 'users' // Sets folder to 'users' if the URL contains "users"
        } else if (request.baseUrl.includes('pets')) {
            folder = 'pets' // Sets folder to 'pets' if the URL contains "pets"
        }

        // The callback is used to specify the folder where the file will be stored
        // First argument (null) is for the error (if any); here it's null because there is no error
        callback(null, `public/images/${folder}`) // Sets the storage path for the uploaded file
    },
    filename: function(request, file, callback) {
        // Generates a unique filename using the current timestamp (Date.now())
        // `path.extname(file.originalname)` extracts the file extension (e.g., .jpg, .png) from the original file name
        callback(null, Date.now() + String(Math.floor(Math.random() * 100)) +path.extname(file.originalname)) // Combines timestamp and file extension for a unique filename
    }
})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(request,file,callback){
        if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
            return callback(new Error('Only .png, .jpg and .jpeg format are allowed'))
        }
        callback(undefined,true)
    }
})
// Esse aqui precisa de comentarios pq realmente é meio dificil entender

module.exports = {imageUpload}