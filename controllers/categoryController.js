const { validationResult } = require('express-validator')
const Category = require('../models/Category')

module.exports = {
  createCategory: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    try {
      let category = await Category.findOne({ name: req.body.name })
      if (category) return res.status(400).send({ statusCode: 400, message: 'Category already exists' })
      else category = await Category.create(req.body)
      res.status(201).send({ statusCode: 201, category })
    } catch (err) {
      console.log(err.message, err)
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }
}