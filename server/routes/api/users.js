const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require("validator")
const keys = require('../../config/keys')
const multer = require('multer')
const path = require('path')

const router = express.Router()
const User = mongoose.model('User')
const Organization = mongoose.model('Organization')

// Set Storage Engine for multer
const storage = multer.diskStorage({
    destination:  function(req, file, cb) {
        cb(null, '../client/src/uploads')
    },
    filename: function(req, file, cb) {
        console.log(file.mimetype)
        const isImage = file.mimetype.includes('image')
        // if(isImage) {
        //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        // }
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


// Sign up route
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
          cb(null, true)
        } else {
          cb(null, false)
        }
    }
})

router.post('/signup', upload.single('profileImage'), async (req, res) => {
    console.log(1, req.body, req.file)
    const fileName = req.file ? req.file.filename : 'default.png'
    console.log('file', fileName)
    const { firstName, lastName, email, password, confirmedPassword } = req.body

    if (!email || !password || !confirmedPassword || !firstName || !lastName) {
        return res.send({
        status: 400,
        message: 'Please fill in all user details',
        })
    } else if (firstName.length < 2) {
        return res.send({
        status: 400,
        message: 'First name should contain at least 2 characters',
        })
    } else if (lastName.length < 2) {
        return res.send({
        status: 400,
        message: 'Last name should contain at least 2 characters',
        })
    } else if (password.length < 7) {
        return res.send({
        status: 400,
        message: 'Password should contain at least 7 characters',
        })
    } else if (password !== confirmedPassword) {
        return res.send({ status: 400, message: 'Passwords did not match' })
    } else if (!validator.isEmail(email)) {
        return res.send({ status: 400, message: 'Email is not in valid format' })
    } else {
        try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, keys.saltedRounds)
    
        // Check if email exists
        const existingEmail = await User.findOne({ email })
        if(existingEmail) {
            return res.send({status: 400, message: 'Email already exists'})
        }
    
        // Save user
        const user = User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImage: fileName 
        })
        
        await user.save()
    
        return res.send({ status: 200, message: 'Registered! please go to login' })
        } catch(err) {
            console.log(err)
            return res.send({ status: 400, message: err.message })
        }
    }
})

//login 
router.post("/login", async (req, res) => {
    const { email, password } = req.body
    if(!email || !password) {
      return res.send({status: 400, message: 'Fillin all user details'})
    }
  
    try {  
      const user = await User.findOne({ email })
      if(!user) {
        return res.send({ status: 404, message: 'Wrong email or password' })
      }
  
      const userPassword = user.password
  
      const doPasswordsMatch = await bcrypt.compare(password, userPassword)
  
      if(!doPasswordsMatch) {
        return res.send({ status: 404, message: 'Wrong email or password' })
      }
  
  
      req.session.user = user
      console.log(req.session.user)
      return res.send({status: 200, message: user})
  
    } catch(err) {
      return res.send({ status: 500, message: err.message })
    }
  
})

// get current user
router.get('/current-user', (req, res) => {
    return res.send(req.session.user)
})

// logout
router.get('/logout', (req, res) => {
    req.session = null
    res.redirect('/login')
})


// get notifications

//change to notifications
// find all notification models associated with the user
router.get('/invitations', async (req, res) => {
    try {
        const sessionUserId = req.session.user._id
        const user = await User.findById(sessionUserId)
        const organizations = []
        const receivedInvitationsToOrganizations = user.receivedInvitationsToOrganizations
    
        await Promise.all(receivedInvitationsToOrganizations.map(async organizationId => {
            organization = await Organization.findById(organizationId)
            if(organization) {
                organizations.push(organization)
            }
        }))
        console.log('all', organizations)
        res.send({ status: 200, message: organizations })
    } catch(err) {
        res.send({ status: 500, message: 'Server error pls try again later!' })
    }
})

// accept or decline invitatio
router.post('/invitations', async (req, res) => {
    try {
        const { organizationId, action } = req.body
        const sessionUserId = req.session.user._id
        const user = await User.findById(sessionUserId)
    
        if(action == 'accept') {
            if(!user.activeOrganizations.includes(organizationId)) {
                user.activeOrganizations.push(organizationId)
            }
        }
    
        user.receivedInvitationsToOrganizations = user.receivedInvitationsToOrganizations.filter((receivedInvitationsToOrganizationId => receivedInvitationsToOrganizationId != organizationId))
        await user.save()

        res.send({ status: 200, message: 'action completed' })
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.get('/my-organizations', async (req, res) => {
    try {
        const sessionUserId = req.session.user._id
        const user = await User.findById(sessionUserId)
        const activeOrganizationsId = user.activeOrganizations
        const organizations = []
        
        await Promise.all(activeOrganizationsId.map(async organizationId => {
            const organization = await Organization.findById(organizationId)
            organizations.push(organization)
        }))
        console.log(organizations)
        res.send({ status: 200, message: organizations })
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})


module.exports = router