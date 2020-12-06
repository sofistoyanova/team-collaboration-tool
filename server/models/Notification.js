const { ObjectID, ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const { Schema } = mongoose

const notificationSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    for: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: 'User'
    },
    organization: {
        type: ObjectId,
        ref: 'Organization'
    }
})

// Compile Schema into a model
mongoose.model('Notification', notificationSchema)