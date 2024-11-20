const router = require('express').Router()

const PetController = require('../controllers/PetController')

// middlewares
const verifyToken = require('../helpers/verify-token')
const {imageUpload} = require('../helpers/image-upload')

    router.post('/create',
    imageUpload.array('images'),
    verifyToken,
    PetController.create
)

router.get('/', PetController.getAll)
router.get('/mypets', verifyToken,PetController.getAllUsersPets)
router.get('/myadoptions', verifyToken,PetController.getAllUserAdoptions)
router.get('/:id',PetController.getPetById)
router.delete('/:id',verifyToken,PetController.removePetById)

module.exports = router
