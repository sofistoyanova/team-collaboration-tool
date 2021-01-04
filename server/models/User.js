const { ObjectID } = require('mongodb')
const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7

    },
    profileImage : {
        type: String,
        default: 'default.png'
    },
    activeOrganizations: [
        {
            type: ObjectID,
            ref: 'Organization'
        }
    ],
    receivedInvitationsToOrganizations: [
        {
            type: ObjectID,
            ref: 'Organization'
        }
    ],
    sentInvitationsToOrganizations: [
        {
            type: ObjectID,
            ref: 'Organization'
        }
    ]
})

mongoose.model('User', userSchema)