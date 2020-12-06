const express = require('express')
const app = express()

const userRoutes = require('./api/users')
const organizationRoutes = require('./api/organizations')
const notificationRoutes = require('./api/notifications')

app.use('/users', userRoutes)
app.use('/organizations', organizationRoutes)
app.use('/notifications', notificationRoutes)

module.exports = app