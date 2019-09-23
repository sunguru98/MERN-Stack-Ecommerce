const { Router } = require('express')
const { generalFunction } = require('../controllers/userControllers')

const router = Router()

router.get('/', generalFunction)

module.exports = router


