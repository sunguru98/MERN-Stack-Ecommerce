const { Router } = require('express')
const userControllers = require('../controllers/userControllers')

const router = Router()

router.get('/', userControllers.generalFunction)

module.exports = router


