const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const multer = require('multer')
const path = require('path')

const keys = require('../../config/keys')
const { gmailEmail, gmailPassword } = keys
const { invitationEmailTemplate, taskAlertTemplate } = require('../../helpers/email-templates')
const { stat } = require('fs')

const router = express.Router()
const Organization = mongoose.model('Organization')
const User = mongoose.model('User')
const Notification = mongoose.model('Notification')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        port: 587,
        secure: false,
        user: gmailEmail,
        pass: gmailPassword
    }
})

// Set Storage Engine for multer
const storage = multer.diskStorage({
    destination:  function(req, file, cb) {
        cb(null, '../client/src/uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


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

router.get('/assignees', async (req, res) => {
    try {
        const { organizationId } = req.query
        const users = await User.find({activeOrganizations: organizationId})
        if(!users) {
            return res.send({status: 404, message: []})
        }
    
        return res.send({status: 200, message: users})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.delete('/member', async (req, res) => {
    const { organizationId, memberId } = req.query

    try {
        await User.updateMany({activeOrganizations: organizationId, _id: memberId}, {$pull: {activeOrganizations: organizationId}})
        return res.send({status: 200, message: 'Success'})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.get('/members', async (req, res) => {
    try {
        const { organizationId } = req.query
        const users = await User.find({activeOrganizations: organizationId})
        
        if(users.length > 0) {
            return res.send({status: 200, message: users})
        }

        return res.send({status: 404, message: 'no members'})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.delete('/', async (req, res) => {
    const organizationId = req.query.id

    try {
        const organization = await Organization.findById(organizationId)
        const sessionUserId = req.session.user._id
        
        if(organization.admin != sessionUserId) {
            return res.send({status: 401, message: 'Unauthotized'})
        }
        
        await User.updateMany({activeOrganizations: organizationId}, {$pull: {activeOrganizations: organizationId}})

        await Organization.findByIdAndDelete(organizationId)
        return res.send({status: 200, message: 'Success'})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.post('/request-respond', async (req, res) => {
    const { action, userId, organizationId } = req.body
    const adminId = req.session.user._id

    try {
        const admin = await User.findById(adminId)
        const organization = await Organization.findById(organizationId)
    
        if(organization.admin != adminId) {
            return res.send({status: 401, message: 'Unauthotized'})
        }

        const user = await User.findById(userId)

        let userSentInvitations = user.sentInvitationsToOrganizations
        userSentInvitations = userSentInvitations.filter(id => {
            return id != organizationId
        })

        user.sentInvitationsToOrganizations = userSentInvitations

        await Notification.deleteOne({type: 'request', for: 'organization', user: userId, organization: organizationId})

        if(action === 'accept') {
            if(!user.activeOrganizations.includes(organization._id)) {
                user.activeOrganizations.push(organization._id)
            }
            
            const findExistingNotification = await Notification.findOne({
                type: 'response',
                for: 'user',
                user: userId,
                organization: organizationId
            })
            
            if(!findExistingNotification) {
                const userNotification = await Notification({
                    type: 'response',
                    for: 'user',
                    user: userId,
                    organization: organizationId
                })
    
                userNotification.save()
            }

        }
    
        await user.save()
        return res.send({status: 200, message: 'Success'})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.post('/join', async (req, res) => {
    const sessionUserId = req.session.user._id
    try {
        const user = await User.findById(sessionUserId)
        const organizationName = req.body.organizationName.toLowerCase()

        // find organization
        const organization = await Organization.findOne({name: organizationName})
        let alreadyMember = false
        let alreadyInvitationSent = false

        if(organization) {
            const organizationId = organization._id

            await Promise.all(user.activeOrganizations.map(async activeOrganizationId => {
                if(JSON.stringify(activeOrganizationId) === JSON.stringify(organizationId)) {
                    return alreadyMember = true
                }
            }))

            await Promise.all(user.sentInvitationsToOrganizations.map(async sentInvitationsToOrganizationId => {
                if(JSON.stringify(sentInvitationsToOrganizationId) === JSON.stringify(organizationId)) {
                    return alreadyInvitationSent = true
                }
            }))

            await Promise.all(user.receivedInvitationsToOrganizations.map(async receivedInvitationsToOrganizationId => {
                if(JSON.stringify(receivedInvitationsToOrganizationId) === JSON.stringify(organizationId)) {
                    return alreadyInvitationSent = true
                }
            }))
        } else {
            return res.send({status: 400, message: 'organization not found'})
        }


        if(alreadyMember || alreadyInvitationSent) {
            return res.send({status: 400, message: 'already a member or previous invitation was sent'})
        }

        // update user sentInvitationsToOrganizations
        await user.sentInvitationsToOrganizations.push(organization.id)
        await user.save()

        const notification = await Notification({
            type: 'request',
            for: 'organization',
            user: sessionUserId,
            organization: organization.id
        })
        
        // create notification for organization
        await notification.save()
        return res.send({status: 400, message: 'invitation was sent'})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.post('/invite', async (req, res) => {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })
        const receivedInvitations = user.receivedInvitationsToOrganizations
        receivedInvitations.push(req.query.id)

        await user.save()
        return res.send({status: 200, message: 'invitation sent'})
    } catch(err) {
        return res.send({status: 500, message: 'server error'})
    }
})

router.get('/', async (req, res) => {
    try {
        const { id } = req.query
        const organization = await Organization.findById(id)

        if(organization) {
            return res.send({status: 200, message: organization})
        }
        return res.send({status: 404, message: 'Does not exists'})
    } catch(err) {
        return res.send({status: 500, message: 'server error'})
    }
})

router.post('/', async (req, res) => {
    let { name, emails } = req.body
    const sessionUserId = req.session.user._id
    
    if(!name) {
        name = name.toLowerCase()
        return res.send({
            status: 400,
            message: 'please provide a name'
        })
    }

    try {
        const existingOrganizationName = await Organization.findOne({ name })
        if(existingOrganizationName) {
            return res.send({
                status: 400,
                message: 'organization name already taken'
            })
        }
        const organization = Organization({ name: name.toLowerCase(), admin: sessionUserId })
        const user = await User.findById(sessionUserId)
        const { activeOrganizations } = user
        activeOrganizations.push(organization._id)

        await user.save()
        await organization.save()

        

        // sent invitation email to users
        emails.map(async email => {
            const invitationEmail = invitationEmailTemplate(email, name)

            transporter.sendMail(invitationEmail, (err, info) => {
                if(err) {
                    return res.send({status: 500, message: 'Server error, try again later'})
                }
            })

            const user = await User.findOne({ email })
            const receivedInvitations = user.receivedInvitationsToOrganizations
            receivedInvitations.push(organization._id)
            await user.save()
        })

        return res.send({
            status: 200,
            message: 'Created!'
        })
    } catch (err) {
        return res.send({
            status: 500,
            message: 'Server error try again later'
        })
    }
})

//TASKS
router.post('/tasks/', upload.single('media'), async (req, res) => {
    const formData = req.body
    const {title, description, assignee, deadline, urgent} = formData
    const fileName = req.file ? req.file.filename : ''
    const creatorId = req.session.user._id
    const email = assignee.split(' - ')[1]
    const isUrgent = urgent.toLowerCase() == 'no' ? false : true
    const today = new Date()
    const { organizationId } = req.query
    
    try {
        if(!title || !description || !assignee) {
            return res.send({status: 400, message: 'Name, description and assignee are required'})
        }

        const assignedUser = await User.findOne({ email })
        const organization = await Organization.findById(organizationId)
        const task = {
            title,
            description,
            creator: creatorId,
            assignee: assignedUser._id,
            deadline,
            createdAt: today.setHours(0, 0, 0, 0), 
            urgent: isUrgent,
            media: fileName,
            status: 'in-progress'
        }

        organization.tasks.push(task)

        await organization.save()

        if(isUrgent) {
            // send email
            const taskAlertEmail = taskAlertTemplate(email, organization.name, title)
            transporter.sendMail(taskAlertEmail, (err, info) => {
                if(err) {
                    console.log(err)
                }
            })
        }

        console.log('all task', organization.tasks)
        const allTasks = organization.tasks
        return res.send({status: 200, message: allTasks})
    } catch(err) {
        console.log(err)
        return res.send({ status: 500, message: 'server error' })
    }
})


router.get('/tasks/', async (req, res) => {
    try {
        const { organizationId } = req.query
        const organization = await Organization.findById(organizationId)
        if(organization.tasks.length < 1) {
            return res.send({status: 404, message: 'no tasks'})
        }
        return res.send({status: 200, message: organization.tasks})
    } catch(err) {
        return res.send({ status: 500, message: 'server error' })
    }
})

router.delete('/tasks/', async (req, res) => {
    const { taskId, organizationId } = req.query
    const sessionUserId = req.session.user._id

    try {
        const organization = await Organization.findById(organizationId)
        const filteredTasks = organization.tasks.filter(task => task.id != taskId)
        organization.tasks = filteredTasks

        await organization.save()
        return res.send({status: 200, message: organization.tasks})
    } catch(err) {
        res.status(400).send('server error')
    }
})

router.patch('/tasks/', async (req, res) => {
    const {taskId, organizationId} = req.query
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'description', 'status']

    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send({status: 400, message: 'invalid updates'})
    }

    try{
        const organization = await Organization.findById(organizationId)

        organization.tasks.map(task => {
            if(task.id == taskId) {
                updates.forEach((update) => {
                    task[update] = req.body[update]
                })
            }
        })

        await organization.save()
        return res.send({status: 200, message: organization.tasks})
    }catch(e) {
        res.status(400).send(e)
    }
})

// comments
router.post('/tasks/comments/', async (req, res) => {
    const { taskId, organizationId } = req.query
    const { comment } = req.body
    const authorId = req.session.user._id
    let commentsArr = []

    try {
        const organization = await Organization.findById(organizationId)
        await Promise.all(organization.tasks.map(async task => {
            if(task._id == taskId) {
                const author = await User.findById(authorId)
                task.comments.push({text: comment, author: author.email})
                commentsArr = task.comments
            }
        }))

        await organization.save()
        return res.send({status: 200, message: commentsArr})
    } catch(err) {
        console.log(err)
        res.status(400).send('server error')
    }
})

router.get('/tasks/comments/', async (req, res) => {
    const { taskId, organizationId } = req.query

    try {
        const organization = await Organization.findById(organizationId)
        let message = 'task do not exists'
        let status = 200
        organization.tasks.map(task => {
            if(task._id == taskId) {
                if(task.comments.length < 1) {
                    message = 'No comments yet'
                    status = 404
                } else {
                    status = 200
                    message = task.comments
                }
            }
        })
        return res.send({status, message})
    } catch(err) {
        res.status(400).send('server error')
    }
})

router.delete('/tasks/comments/', async (req, res) => {
    const { commentId, taskId, organizationId } = req.query
    let commentsArr = []
    try {
        const organization = await Organization.findById(organizationId)
        organization.tasks.map(task => {
            if(task.id == taskId) {
                const filteredComments = task.comments.filter(comment => comment._id != commentId)
                task.comments = filteredComments
                commentsArr = task.comments
            }
        })
        
        await organization.save()
        return res.send({status: 200, message: commentsArr})
    } catch(err) {
        console.log(err)
        res.status(400).send('server error')
    }
})


module.exports = router