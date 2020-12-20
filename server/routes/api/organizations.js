const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const keys = require('../../config/keys')
const { gmailEmail, gmailPassword } = keys
const { invitationEmailTemplate } = require('../../helpers/email-templates')

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

router.get('/assignees', async (req, res) => {
    try {
        const { organizationId } = req.query
        console.log('id', organizationId)
        const users = await User.find({activeOrganizations: organizationId})
        console.log('assignes', typeof users)
        if(!users) {
            return res.send({status: 404, message: []})
        }
    
        return res.send({status: 200, message: users})
    } catch(err) {
        console.log(err)
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

        // find user
        const users = await User.find({activeOrganizations: organizationId})
        
        if(users.length > 0) {
            return res.send({status: 200, message: users})
        }

        return res.send({status: 404, message: 'no members'})
        // 
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

// delete organization route
router.delete('/', async (req, res) => {
    const organizationId = req.query.id

    try {
        const organization = await Organization.findById(organizationId)
        const sessionUserId = req.session.user._id
        
        if(organization.admin != sessionUserId) {
            return res.send({status: 401, message: 'Unauthotized'})
        }
        
        const query = {}
        //const users = await User.findM({activeOrganizations: organizationId})
        await User.updateMany({activeOrganizations: organizationId}, {$pull: {activeOrganizations: organizationId}})

        //console.log('u', users)
        await Organization.findByIdAndDelete(organizationId)
        return res.send({status: 200, message: 'Success'})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

router.post('/request-respond', async (req, res) => {
    const { action, userId, organizationId } = req.body
    // find admin 
    const adminId = req.session.user._id

    try {
        const admin = await User.findById(adminId)
        const organization = await Organization.findById(organizationId)
    
        // allow only admin to do the actions
        if(organization.admin != adminId) {
            console.log(organization.admin, adminId)
            return res.send({status: 401, message: 'Unauthotized'})
        }
        // find user
        const user = await User.findById(userId)

        // delete from sentInvitationsToOrganizations
        let userSentInvitations = user.sentInvitationsToOrganizations
        userSentInvitations = userSentInvitations.filter(id => {
            return id != organizationId
        })

        user.sentInvitationsToOrganizations = userSentInvitations

        // delete notification for user
        await Notification.deleteOne({type: 'request', for: 'organization', user: userId, organization: organizationId})

        // if action is accept - add to active organizations and delete notification
        // create new notification for the user
        if(action === 'accept') {
            if(!user.activeOrganizations.includes(organization._id)) {
                user.activeOrganizations.push(organization._id)
            }
            
            // create new acceptance notification for user
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
        console.log(err)
        res.send({status: 500, message: 'server error'})
    }
})

router.post('/join', async (req, res) => {
    console.log('h', req.body)
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
        console.log(err)
        res.send({status: 500, message: 'server error'})
    }
})

router.post('/invite', async (req, res) => {
    const { email } = req.body
    console.log(req.body)
    try {
        const user = await User.findOne({ email })
        const receivedInvitations = user.receivedInvitationsToOrganizations
        receivedInvitations.push(req.query.id)
        await user.save()

        // check if user not found what happens - do not sace anything

        // check if organization is already in receivedInvitations or active invitations
        // if yes do not send again
        
        return res.send({status: 200, message: 'invitation sent'})
    } catch(err) {
        console.log(err)
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
        console.log(err)
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
    console.log(emails)
    try {
        const existingOrganizationName = await Organization.findOne({ name })
        if(existingOrganizationName) {
            return res.send({
                status: 400,
                message: 'organization name already taken'
            })
        }
        const organization = Organization({ name: name, admin: sessionUserId })
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
                    console.log(err)
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
        console.log(err)
        return res.send({
            status: 500,
            message: 'Server error try again later'
        })
    }
})

module.exports = router