const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const keys = require('../../config/keys')
const { gmailEmail, gmailPassword } = keys
const { invitationEmailTemplate } = require('../../helpers/email-templates')

const router = express.Router()
const Organization = mongoose.model('Organization')
const User = mongoose.model('User')

let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        port: 587,
        secure: false,
        user: gmailEmail,
        pass: gmailPassword
    }
})

router.post('/invite', async (req, res) => {
    const { email } = req.body
    console.log(req.body)
    try {
        const user = await User.findOne({ email })
        const receivedInvitations = user.receivedInvitationsToOrganizations
        receivedInvitations.push(receivedInvitations._id)
        await user.save()

        // check if user not found what happend

        // check if organization is already in receivedInvitations or active invitations
        // if yes do not send again
        
        return res.send({status: 200, message: 'invitation sent'})
    } catch(err) {
        console.log(err)
        return res.send({status: 500, message: 'server error'})
    }
})

router.post('/', async (req, res) => {
    const { name, emails } = req.body
    const sessionUserId = req.session.user._id

    if(!name) {
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