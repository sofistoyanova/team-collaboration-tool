const express = require('express')
const mongoose = require('mongoose')
const multer = require('multer')
const path = require('path')
const webPush = require('web-push')
const keys = require('../../config/keys')

const router = express.Router()
const Organization = mongoose.model('Organization')
const User = mongoose.model('User')
const Notification = mongoose.model('Notification')
const Task = mongoose.model('Task')


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
        // create task
        if(!title || !description || !assignee) {
            return res.send({status: 400, message: 'Name, description and assignee are required'})
        }

        const assignedUser = await User.findOne({ email })
        //console.log(assignedUser, email, assignedUser._id)

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

        const allTasks = await Task.find({ organization: organizationId })
        //console.log(allTasks)
        return res.send({status: 200, message: allTasks})
    } catch(err) {
        return res.send({ status: 500, message: 'server error' })
    }
})

router.get('/', async (req, res) => {
    try {
        const { organizationId } = req.query
        const tasks = await Task.find({ organization: organizationId })
        //console.log('tasks', tasks, organizationId)
        if(tasks.length < 1) {
            return res.send({status: 404, message: 'no tasks'})
        }
        return res.send({status: 200, message: tasks})
    } catch(err) {
        console.log(err)
        return res.send({ status: 500, message: 'server error' })
    }
})

module.exports = router