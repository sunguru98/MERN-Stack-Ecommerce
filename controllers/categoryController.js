const { validationResult } = require('express-validator')
const Category = require('../models/Category')

module.exports = {

  // Create a new category
  createCategory: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    try {
      let category = await Category.findOne({ name: req.body.name })
      if (category) return res.status(400).send({ statusCode: 400, message: 'Category already exists' })
      else category = new Category(req.body)
      category.user = req.user._id
      await category.save()
      category = await category.populate('user', ['name']).execPopulate()
      res.status(201).send({ statusCode: 201, category })
    } catch (err) {
      console.log(err.message)
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Grab all categories
  fetchAllCategories: async (req, res) => {
    try {
      const categories = await Category.find({}).populate('user', 'name')
      res.send({ statusCode: 200, categories })
    } catch (err) {
      console.error(err.message)
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Grab a particular category
  fetchCategoryById: async (req, res) => {
    const { categoryId } = req.params
    if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Category Id not found' })
    try {
      const category = await Category.findById(categoryId).populate('user', 'name')
      if (!category) return res.status(404).send({ statusCode: 404, message: 'Category not found' })
      res.send({ statusCode: 200, category })
    } catch (err) {
      console.error(err.message)
      if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Update that user created category
  updateCategoryById: async (req, res) => {
    const { categoryId } = req.params
    if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Category Id not found' })
    try {
      const category = await Category.findOneAndUpdate({ _id: categoryId, user: req.user._id }, { $set: req.body }, { new: true }).populate('user', ['name'])
      if (!category) return res.status(404).send({ statusCode: 404, message: 'Category not found' })
      res.send({ statusCode: 200, category })
    } catch (err) {
      console.error(err.message)
      if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Category Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Delete that user created category
  deleteCategoryById: async (req, res) => {
    const { categoryId } = req.params
    if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Category Id not found' })
    try {
      let category = await Category.findOne({ _id: categoryId, user: req.user._id })
      if (!category) return res.status(404).send({ statusCode: 404, message: 'Category not found' })
      await category.remove()
      category = await category.populate('user', ['name']).execPopulate()
      res.send({ statusCode: 200, category })
    } catch (err) {
      console.error(err.message)
      if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Category Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }

}