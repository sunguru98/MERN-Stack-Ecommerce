const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin')
const { signinUser, signupUser, signoutUser } = require('../controllers/userControllers')
const { check } = require('express-validator')
const router = Router()

// @route - POST /api/users/
// @desc - Register a new user
// @method - Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty(),
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password is required').not().isEmpty(),
  check('password', 'Password must be greater than 6 characters').isLength({ min: 6 }),
  check('password', 'Password must contain atleast one digit').isAlphanumeric(),
  check('description', 'Description is required').not().isEmpty()
], signupUser)

// @route - POST /api/users/
// @desc - Signin a user
// @method - Public
router.get('/', [
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()
], signinUser)

// @route - DELETE /api/users/
// @desc - Signin a user
// @method - Private
router.delete('/', authenticate, signoutUser)

router.get('/test', authenticate, isAdmin, (req, res) => {
  res.send({ statusCode: 200, message: 'You are an admin' })
})

module.exports = router


