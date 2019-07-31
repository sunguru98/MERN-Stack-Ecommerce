const express = require('express')
const app = express()
const mongoose = require('mongoose')
// Allows us to read .env variables
require('dotenv').config()

// Db Connect
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => console.log('Db Connected'))

// Routers
const userRoutes = require('./routes/userRoutes')

const port = process.env.PORT || 9998

app.use('/api', userRoutes)

app.listen(port, () => console.log('Server started'))