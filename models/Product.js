const { Schema, model } = require('mongoose')

const productSchema = new Schema({
  name: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true},
  price: { type: Number, trim: true, required: true},
  category: { type: Schema.Types.ObjectId, ref: 'category' },
  totalQuantity: { type: Number, required: true },
  photos: [String],

}, { timestamps: true })

productSchema.methods = {
  toJSON: function () {
    const product = this.toObject()
    delete product.__v
    return product
  }
}

const Product = model('product', productSchema)
module.exports = Product