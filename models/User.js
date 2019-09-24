const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'Email is required'],
    unique: true,
    validate (value) {
      if (!validator.isEmail(value)) throw new Error('Email is invalid')
    }
  },
  isAdmin: { type: Boolean, default: false },
  password: {
    type: String,
    required: [true, 'Password is required'],
    validate (value) {
      if (value.length < 6) throw new Error('Password\'s length must be greater than 6 characters')
    }
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  history: [],
  accessToken: String
}, {
  timestamps: true
})

userSchema.statics = {
  authenticateUser: async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) throw new Error('Invalid credentials')
    const isMatched = await bcrypt.compare(password, user.password)
    if (!isMatched) throw new Error('Invalid credentials')
    return user
  }
}

userSchema.methods = {
  toJSON: function () {
    const user = this.toObject()
    delete user.password
    delete user.accessToken
    delete user.__v
    return user
  },
  generateToken: async function () {
    const accessToken = await jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h' })
    this.accessToken = accessToken
    await this.save()
    return accessToken
  }
}

// Before saving passwords to database, we hash them
userSchema.pre('save', async function (next) {
  // If password is new means
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (err) { throw new Error(err) }
  }
  next()
})

const User = model('user', userSchema)
module.exports = User