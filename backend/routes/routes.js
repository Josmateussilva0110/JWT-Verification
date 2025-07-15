const express = require("express")
const router = express.Router()
const UserController = require("../controllers/userController")
const verifyToken = require("../middleware/verifyToken")
const imageUpload = require("../middleware/image_upload")


router.post('/user/register', UserController.register)
router.post('/user/login', UserController.login)
router.get('/user/check_user', UserController.checkUser)
router.get('/user/:id', UserController.getUserById)
router.patch('/user/:id', verifyToken, imageUpload.single('photo'), UserController.editUser)


module.exports = router
