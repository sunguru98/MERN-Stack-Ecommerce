const express = require('express')
const morgan = require('morgan')

// Allows us to read .env variables
require('dotenv').config({ path: './.env' })
require('./db')

const app = express()
const port = process.env.PORT || 5000

// Routers
const userRoutes = require('./routes/userRoutes')

// Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use('/api', userRoutes)

app.listen(port, () => console.log(`Server started on port ${port}`))