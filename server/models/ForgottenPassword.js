const mongoose = require('mongoose')
const { Schema } = mongoose

const ForgottenPasswordSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    token: {
        type: String,
        required: true,
    }
})

// Compile Schema into a model
mongoose.model('ForgottenPassword', ForgottenPasswordSchema)