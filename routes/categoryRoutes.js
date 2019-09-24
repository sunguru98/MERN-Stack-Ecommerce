const { Router } = require('express')
const { check } = require('express-validator')

const authenticate = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin')
const { createCategory, fetchAllCategories, fetchCategoryById, updateCategoryById, deleteCategoryById } = require('../controllers/categoryController')

const router = Router()

// @route - POST /api/categories/
// @desc - Register a new user
// @method - Private (Both Auth and Admin)
router.post('/', authenticate, isAdmin, [
  check('name', 'Name is required').not().isEmpty()
], createCategory)

// @route - GET /api/categories/
// @desc - Fetch all categories
// @method - Public
router.get('/', fetchAllCategories)

// @route - GET /api/categories/:categoryId
// @desc - Fetch a category
// @method - Public
router.get('/:categoryId', fetchCategoryById)

// @route - PUT /api/categories/:categoryId
// @desc - Update a category
// @method - Private (Both Auth and Admin)
router.put('/:categoryId', authenticate, isAdmin, updateCategoryById)

// @route - DELETE /api/categories/:categoryId
// @desc - Delete a category
// @method - Private (Both Auth and Admin)
router.delete('/:categoryId', authenticate, isAdmin, deleteCategoryById)

module.exports = router