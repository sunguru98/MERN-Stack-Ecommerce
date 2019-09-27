const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

// Allows us to read .env variables
require('dotenv').config({ path: './.env' })
require('./db')

const app = express()
const port = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use(cors())
app.use('/uploads', express.static('uploads'))

// Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/categories', require('./routes/categoryRoutes'))
app.use('/api/products', require('./routes/productRoutes'))

app.listen(port, () => console.log(`Server started on port ${port}`))