const Product = require('../models/Product')
const multer = require('multer')
const { storage, limits, fileFilter } = require('../utils/mutlerUtils')
const upload = multer({ storage, limits, fileFilter }).array('product-image', 3)

module.exports = {
  createProduct: async (req, res) => {
    upload (req, res, async err => {
      if (err) return res.status(400).send({ statusCode: 400, message: err.message })
      const { categoryId } = req.params
      if (!categoryId) return res.status(400).send({ statusCode: 400, message: 'Invalid Category Id' })
      try {
        const filePaths = req.files.map(file => file.path)
        if (await Product.findOne({ name: req.body.name }))
          return res.status(400).send({ statusCode: 400, message: 'Product already exists' })
        let product = new Product(req.body)
        product.category = categoryId
        product.photos = product.photos.concat(filePaths)
        await product.save()
        product = await product.populate('category', ['name']).execPopulate()
        res.status(201).send({ statusCode: 201, product })
      } catch (err) {
        console.log(err.message)
        res.status(500).send({ statusCode: 500, message: 'Server Error'})
      }
    })
  }
}