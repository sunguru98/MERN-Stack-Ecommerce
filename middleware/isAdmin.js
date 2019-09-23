const User = require('../models/User')

const isAdmin = async (req, res, next) => {
  const user = req.user
  console.log(user)
  try {
    const adminUser = await User.findOne({ _id: user._id, isAdmin: true })
    if (!adminUser) throw new Error('Not admin')
    req.user = adminUser
    next()
  } catch (err) {
    console.log(err.message)
    res.status(401).send({ statusCode: 401, message: 'Invalid Credentials' })
  }
}

module.exports = isAdmin