const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const { Schema } = mongoose

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    creator: {
        type: ObjectID,
        ref: 'User'
    },
    assignee: {
        type: ObjectID,
        ref: 'User'
    },
    deadline: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    urgent: {
        type: Boolean,
        required: true
    },
    media: {
        type: String,
        required: false
    },
    organization: {
        type: ObjectID,
        ref: 'Organization'
    },
    status: { // three types: - unfinished, duringReview, finished
        type: String,
        required: true
    }
})

// Compile Schema into a model
mongoose.model('Task', TaskSchema)