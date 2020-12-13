const express = require('express')
const app = express()

const userRoutes = require('./api/users')
const organizationRoutes = require('./api/organizations')
const notificationRoutes = require('./api/notifications')
const taskRoutes = require('./api/tasks')

app.use('/users', userRoutes)
app.use('/organizations', organizationRoutes)
app.use('/notifications', notificationRoutes)
app.use('/tasks', taskRoutes)

module.exports = app