const { Schema, model } = require('mongoose')
const Product = require('./Product')

const categorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'user' }
}, { timestamps: true })

categorySchema.methods = {
  toJSON: function () {
    const category = this.toObject()
    delete category.__v
    return category
  }
}

categorySchema.pre('remove', async function (next) {
  try {
    await Product.deleteMany({ category: this._id })
    next()
  } catch (err) {
    console.log(err)
  }
})

const Category = model('category', categorySchema)

module.exports = Category
