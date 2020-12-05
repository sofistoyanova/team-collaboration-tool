const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const { Schema } = mongoose

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    admin: {
        type: ObjectID,
        ref: 'User'
    }
})

// Compile Schema into a model
mongoose.model('Organization', organizationSchema)