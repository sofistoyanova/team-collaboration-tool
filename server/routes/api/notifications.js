const express = require('express')
const mongoose = require('mongoose')
const keys = require('../../config/keys')

const router = express.Router()
const Notification = mongoose.model('Notification')
const User = mongoose.model('User')

router.get('/', async (req, res) => {
    let notifications = []
    try {
        const role = req.query.role

        if(role == 'organization') {
            const organizationId = req.query.organizationId
            const organizationNotifications = await Notification.find({for: role, organization: organizationId})

            await Promise.all(organizationNotifications.map(async organizationNotification => {
                const userId = organizationNotification.user
                const user = await User.findById(userId)
                organizationNotification.user = user
                notifications.push(organizationNotification)
            }))
        }

        res.send({status: 200, notifications})
    } catch(err) {
        res.send({status: 500, message: 'server error'})
    }
})

module.exports = router