const { Router } = require('express')
const { check } = require('express-validator')

const authenticate = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin')
const { createCategory } = require('../controllers/categoryController')

const router = Router()

// @route - POST /api/categories/
// @desc - Register a new user
// @method - Private (Both Auth and Admin)
router.post('/', authenticate, isAdmin, [
  check('name', 'Name is required').not().isEmpty()
], createCategory)

module.exports = router