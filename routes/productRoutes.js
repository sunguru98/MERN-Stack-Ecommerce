const { Router } = require('express')
const { check } = require('express-validator')

const authenticate = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin')
const { createProduct } = require('../controllers/productController')

const router = Router()

// @route - POST /api/products/
// @desc - Create a new product
// @method - Private (Both Auth and Admin)

// Don't forget the enctype="multipart/form-data" in your form. (React)

router.post('/:categoryId', authenticate, isAdmin, [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required').not().isEmpty(),
  check('totalQuantity', 'Total quantity is required').not().isEmpty()
], createProduct)

module.exports = router