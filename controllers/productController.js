const rimraf = require('rimraf')
const path = require('path')
const fs = require('fs')
const { validationResult } = require('express-validator')
const Product = require('../models/Product')

module.exports = {

  // Create a new product
  createProduct: async (req, res) => {
    console.log(req.files)
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    if (req.files.length < 3) return res.status(400).send({ statusCode: 400, message: 'Minimum 3 images required' })
    const { categoryId } = req.params
    if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Invalid Category Id' })
    try {
      const filePaths = req.files.map(file => `/${file.path}`)
      if (await Product.findOne({ name: req.body.name }))
        return res.status(400).send({ statusCode: 400, message: 'Product already exists' })
      let product = new Product(req.body)
      product.user = req.user._id
      product.category = categoryId
      product.photos = product.photos.concat(filePaths)
      await product.save()
      product = await product.populate('user', ['name']).populate('category', ['name']).execPopulate()
      res.status(201).send({ statusCode: 201, product })
    } catch (err) {
      console.log(err.message)
      if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error'})
    }
  },

  // Fetch All products
  fetchAllProducts: async (req, res) => {
    try {
      const products = await Product.find({}).populate('category', ['name'])
      if (!products) res.status(404).send({ statusCode: 404, message: 'No products are found' })
      res.send({ statusCode: 200, products })
    } catch (err) {
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Fetch a particular product by ID
  fetchProductById: async (req, res) => {
    const { productId } = req.params
    if (!productId) return res.status(400).send({ statusCode: 400, message: 'Product Id not found' })
    try {
      const product = await Product.findById(productId).populate('category', ['name'])
      if (!product) return res.status(404).send({ statusCode: 404, message: 'Product not found' })
      res.send({ statusCode: 200, product })
    } catch (err) {
      console.error(err.message)
      if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Update a product by ID
  updateProductById: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).send({ statusCode: 400, message: errors.array() })
    const { productId } = req.params
    if (!productId) return res.status(400).send({ statusCode: 400, message: 'Product Id not found' })
    try {
      const filePaths = req.files.map(file => `/${file.path}`)
      const originalFileNames = req.files.map(file => file.originalname)
      fs.readdir(path.join(__dirname, `../uploads/${req.body.name}`), (err, files) => {
        files.forEach(file => {
          if (!originalFileNames.includes(file)) {
            fs.unlink(path.join(__dirname, `../uploads/${req.body.name}/${file}`), () => {})
          }
        })
      })
      let product = await Product.findOneAndUpdate({ user: req.user._id, _id: productId }, { $set: req.body }, { new: true })
      if (!product) return res.status(404).send({ statusCode: 404, message: 'Product not found' })
      product.photos = filePaths
      await product.save()
      product = await product.populate('user', ['name']).populate('category', ['name']).execPopulate()
      res.send({ statusCode: 200, product })
    } catch (err) {
      console.log(err)
      if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  },

  // Delete a product by ID
  deleteProductById: async (req, res) => {
    const { productId } = req.params
    if (!productId) return res.status(400).send({ statusCode: 400, message: 'Product Id not found' })
    try {
      const product = await Product.findByIdAndDelete(productId).populate('user', ['name']).populate('category', ['name'])
      if (!product) return res.status(404).send({ statusCode: 404, message: 'Product not found' })
      rimraf(path.join(__dirname, `../uploads/${product.name}`), () => {
        res.send({ statusCode: 200, product })
      })
    } catch (err) {
      console.log(err.message)
      if (err.name === 'CastError') return res.status(400).send({ statusCode: 400, message: 'Invalid Product Id' })
      res.status(500).send({ statusCode: 500, message: 'Server Error' })
    }
  }
}