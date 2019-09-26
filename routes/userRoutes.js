const { Router } = require('express')
const authenticate = require('../middleware/authenticate')
const isAdmin = require('../middleware/isAdmin')
const User = require('../models/User')
const { signinUser, signupUser, signoutUser, adminSignin, updateUser, fetchUserById } = require('../controllers/userController')
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

// @route - GET /api/users/me
// @desc - Retreive current user details
// @method - Private (Auth)
router.get('/me', authenticate, (req, res) => {
  const user = req.user
  res.send({ statusCode: 200, user })
})

// @route - GET /api/users/:userId
// @desc - Retreive specific user by Id
// @method - Public
router.get('/:userId', fetchUserById)

// @route - POST /api/users/
// @desc - Signin a user
// @method - Public
router.get('/', [
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()
], signinUser)

// @route - PATCH /api/users/
// @desc - Update the authenticated user details
// @method - Private (Auth)
router.patch('/', authenticate, updateUser)

// @route - GET /api/users/admin
// @desc - Signin an admin user
// @method - Private (both auth and admin)
router.get('/admin', [
  check('email', 'Email is required').not().isEmpty(),
  check('password', 'Password is required').not().isEmpty()
], adminSignin, isAdmin, (req, res) => {
  res.send({ statusCode: 200, user: req.user, accessToken: `Bearer ${req.accessToken}`, expiresIn: '24h' })
})

// @route - DELETE /api/users/
// @desc - Signin a user
// @method - Private
router.delete('/', authenticate, signoutUser)


module.exports = router


