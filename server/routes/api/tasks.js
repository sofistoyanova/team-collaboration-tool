const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const nodemailer = require('nodemailer')
const keys = require('../../config/keys')
const { gmailEmail, gmailPassword } = keys
const { taskAlertTemplate } = require('../../helpers/email-templates')

const router = express.Router()
const Organization = mongoose.model('Organization')
const User = mongoose.model('User')
const Notification = mongoose.model('Notification')
const Task = mongoose.model('Task')

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

router.patch('/comments', async (req, res) => {
    const { taskId } = req.query
    const { comment } = req.body
    const authorId = req.session.user._id

    try {
        const task = await Task.findById(taskId)
        const author = await User.findById(authorId)
        task.comments.push({text: comment, author: author.email})

        await task.save()
        return res.send({status: 200, message: task.comments})
    } catch(err) {
        res.status(400).send('server error')
    }
})

router.get('/comments', async (req, res) => {
    const { taskId } = req.query

    try {
        const task = await Task.findById(taskId)
        if(!task) {
            return res.send({status: 200, message: 'task do not exists'})
        }
        if(task.comments.length < 1) {
            return res.send({status: 404, message: 'No comments yet'})
        }
        return res.send({status: 200, message: task.comments})
    } catch(err) {
        res.status(400).send('server error')
    }
})

router.delete('/comments', async (req, res) => {
    const { commentId, taskId } = req.query

    try {
        const task = await Task.findById(taskId)
        const filteredComments = task.comments.filter(comment => comment._id != commentId)
        task.comments = filteredComments
        
        await task.save()
        return res.send({status: 200, message: task.comments})
    } catch(err) {
        res.status(400).send('server error')
    }
})

router.delete('/', async (req, res) => {
    const { taskId, organizationId } = req.query
    const sessionUserId = req.session.user._id

    try {
        const task = await Task.findById(taskId)

        if(task.creator != sessionUserId) {
            return res.send({status: 401, message: 'Unauthotized'})
        }

        await Task.findByIdAndDelete(taskId)
        const allTasks = await Task.find({ organization: organizationId })
        return res.send({status: 200, message: allTasks})
    } catch(err) {
        res.status(400).send('server error')
    }
})

router.patch('/', async (req, res) => {
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
        const task = await Task.findById(taskId)

        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        
       
        if(!task) {
            return res.send({status: 404, message: 'task not found'})
        }

        const allTasks = await Task.find({ organization: organizationId })
        return res.send({status: 200, message: allTasks})
    }catch(e) {
        res.status(400).send(e)
    }
})
 
router.post('/', upload.single('media'), async (req, res) => {
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

        const task = await Task({
            title,
            description,
            creator: creatorId,
            assignee: assignedUser._id,
            deadline,
            createdAt: today.setHours(0, 0, 0, 0), 
            urgent: isUrgent,
            media: fileName,
            organization: organizationId,
            status: 'in-progress'
        })

        await task.save()

        if(isUrgent) {
            // send email
            const taskAlertEmail = taskAlertTemplate(email, organization.name, title)
            transporter.sendMail(taskAlertEmail, (err, info) => {
                if(err) {
                    console.log(err)
                }
            })
        }

        const allTasks = await Task.find({ organization: organizationId })
        return res.send({status: 200, message: allTasks})
    } catch(err) {
        return res.send({ status: 500, message: 'server error' })
    }
})

router.get('/', async (req, res) => {
    try {
        const { organizationId } = req.query
        const tasks = await Task.find({ organization: organizationId })
        if(tasks.length < 1) {
            return res.send({status: 404, message: 'no tasks'})
        }
        return res.send({status: 200, message: tasks})
    } catch(err) {
        return res.send({ status: 500, message: 'server error' })
    }
})

module.exports = router