const { Router } = require('express')
const { UserController } = require('../controllers/users.controller')
const router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/setAvatar/:id', UserController.setAvatar)
router.get('/allUsers/:id', UserController.allUsers) // из за $ne в controllere users тут возвращаются все юзеры кроме того, кто направляет запрос вот для чего у нас в эндпоинте id

module.exports = router
