const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

// Allows us to read .env variables
require('dotenv').config({ path: './.env' })
require('./db')

const app = express()
const port = process.env.PORT || 5000

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

// Routes
app.use('/api/users', require('./routes/userRoutes'))

app.listen(port, () => console.log(`Server started on port ${port}`))