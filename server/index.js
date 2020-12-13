const express = require('express')
const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;
const keys = require('./config/keys')
const session = require('cookie-session')


const PORT = process.env.PORT || 9095
const app = express()
const { mongoURI } = keys

// Open connection to the DB
mongoose
    .connect(keys.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log( err ));


require('./models/User')
require('./models/Organization')
require('./models/Notification')
require('./models/Task')

app.use(express.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5001")
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Credentials", true)
    res.header('Access-Control-Allow-Origin', '*')
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
    next()
})

// initialize cookie
app.use(
    session({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [keys.cookieKey]
    })
) 

// routes
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)


// Server
const server = app.listen(PORT, (error) => {
    if(error) {
        return console.log('Error starting server')
    }
    console.log('Server is running on port:', PORT)
})