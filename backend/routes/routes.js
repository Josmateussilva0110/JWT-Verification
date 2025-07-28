const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const PetController = require("../controllers/petController")
const verifyToken = require("../middleware/verifyToken")
const imageUpload = require("../middleware/image_upload")
const checkImage = require("../middleware/verifyImage")


// rotas para usuário
router.post('/user/register', UserController.register)
router.post('/user/login', UserController.login)
router.get('/user/check_user', UserController.checkUser)
router.get('/user/:id', UserController.getUserById)

router.patch('/user/:id', verifyToken, (request, response, next) => {
    imageUpload.single('photo')(request, response, function (err) {
        if(err) {
            // evitar que a imagem suba no servidor
            return checkImage(err, request, response, next)
        }
        UserController.editUser(request, response)
    })
})

// rotas para pets
router.post('/pet/register', verifyToken, (req, res, next) => {
    imageUpload.array('photos')(req, res, function (err) {
        if (err) {
            return checkImage(err, req, res, next)
        }
        PetController.register(req, res)
    })
})
router.get('/pet/get_pet', PetController.getPets)
router.get('/pet/get_pet/:user_id', verifyToken, PetController.getPetsByUser)
router.get('/pet/:id', PetController.getPetByIdPet)
router.delete('/pet/remove/:id', verifyToken, PetController.remove)
router.patch('/pet/edit/:id', verifyToken, (req, res, next) => {
    imageUpload.array('photos')(req, res, function (err) {
        if (err) {
            return checkImage(err, req, res, next)
        }
        PetController.edit(req, res)
    })
})
router.post('/pet/schedule/:pet_id', verifyToken, PetController.schedule)
router.patch('/pet/complete/schedule/:pet_id', verifyToken, PetController.completeAdoption)

module.exports = router
