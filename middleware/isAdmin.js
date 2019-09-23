const isAdmin = async (req, res, next) => {
  const user = req.user
  try {
    if (!user.isAdmin) throw new Error()
    next()
  } catch (err) {
    res.status(403).send({ statusCode: 403, message: 'You are not an admin' })
  }
}

module.exports = isAdmin