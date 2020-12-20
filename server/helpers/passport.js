const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const keys = require('../config/keys')

const User = mongoose.model('User')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    })
})

// When anyone attempt to authenticate with the string 'google' use me(new GoogleSTrategy - containing little information that connect to the string 'google')
passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientId,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/api/users/auth/google/callback',
            proxy: true
        }, 
        async (accessToken, refreshToken, profile, done) => {
           const firstName = profile._json.given_name
           const lastName = profile._json.family_name
           const email = profile._json.email
           const googleId = profile.id

           const existingUser = await User.findOne({ email: email })

            if(existingUser) {
                done(null, existingUser)
            } else {
                const user = User({
                    firstName,
                    lastName,
                    email,
                    password: 'googlePassword',
                  })
                  
                await user.save()
                done(null, user)
            }
        }
    )
)

module.exports = passport