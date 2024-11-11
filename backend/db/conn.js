const mongoose = require('mongoose')

async function main(){
    await mongoose.connect('mongodb://localhost:27017/cadupet')
    console.log("Conectado ao Mongoose")
}

main().catch((error) => console.log(error))

module.exports = mongoose