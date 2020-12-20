const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: ObjectID,
        red: 'User'
    }
})

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
    },
    comments: [commentSchema]
})

// Compile Schema into a model
mongoose.model('Task', TaskSchema)