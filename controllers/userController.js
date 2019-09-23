const User = require('../models/User')
const { validationResult } = require('express-validator')

module.exports = {

  // Register user
  signupUser: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    if (req.body.isAdmin) return res.status(400).send({ stausCode: 400, message: 'Invalid request' })
    const { email } = req.body
    try {
      let user = await User.findOne({ email })
      if (user) return res.status(400).send({ statusCode: 400, message: 'Email already exists' })
      user = new User(req.body)
      const accessToken = await user.generateToken()
      await user.save()
      res.status(201).send({ statusCode: 201, user, accessToken: `Bearer ${accessToken}`, expiresIn: '24h' })
    } catch (error) {
      console.log(error)
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Login user
  signinUser: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    const { email, password } = req.body
    try {
      const user = await User.authenticateUser(email, password)
      const accessToken = await user.generateToken()
      res.status(200).send({ statusCode: 200, user, accessToken: `Bearer ${accessToken}`, expiresIn: '24h' })
    } catch (err) {
      console.log(err.message)
      if (err.message === 'Invalid credentials') return res.status(401).send({ statusCode: 401, message: err.message })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Admin login
  adminSignin: async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    const { email, password } = req.body
    try {
      const user = await User.authenticateUser(email, password)
      const accessToken = await user.generateToken()
      req.user = user
      req.accessToken = accessToken
      next()
    } catch (err) {
      console.log(err.message)
      if (err.message === 'Invalid credentials') return res.status(401).send({ statusCode: 401, message: err.message })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // logout user
  signoutUser: async (req, res) => {
    const accessToken = req.token
    try {
      const user = await User.findOne({ accessToken })
      if (!user) return res.status(400).send({ statusCode: 400, message: 'Unable to log out user' })
      user.accessToken = null
      await user.save()
      res.send({ statusCode: 200, message: 'User logged out successfully' })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    } 
  }
}