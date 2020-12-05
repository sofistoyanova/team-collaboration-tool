const express = require('express')
const app = express()

const userRoutes = require('./api/users')
const organizationRoutes = require('./api/organizations')

app.use('/users', userRoutes)
app.use('/organizations', organizationRoutes)

module.exports = app