const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const { Schema } = mongoose

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
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
    status: { // three types: - unfinished, duringReview, finished
        type: String,
        required: true
    },
    comments: [CommentSchema]
})

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
    },
    tasks: [TaskSchema]
})

mongoose.model('Organization', organizationSchema)