const { Router } = require('express')
const router = Router()
const userController = require('../controller/userController')
const centerController = require("../controller/vacineController")


router.post("/registor", userController.createUser)

router.post("/login", userController.login)

router.post("/center", centerController.createCenter)

router.get("/center", centerController.getCenter)

router.post("/user/:userId", userController.registerSlot)


module.exports = router