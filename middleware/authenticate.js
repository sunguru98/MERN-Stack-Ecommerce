const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authenticate = async (req, res, next) => {
  let accessToken = req.header('Authorization') || req.accessToken
  try {
    if (!accessToken) throw new Error()
    accessToken = accessToken.replace('Bearer ', '')
    const payload = await jwt.verify(accessToken, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: payload.id, accessToken })
    if (!user) throw new Error()
    req.user = user
    req.token = accessToken
    next()
  } catch (error) {
    res.status(401).send({ statusCode: 401, message: 'Invalid credentials' })
  }
}

module.exports = authenticate