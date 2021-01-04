import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import TasksTable from '../components/TasksTable'
import TaskForm from '../components/TaskForm'
const { getMethod, postMethod } = require('../helpers/request')
const { NavLink } = require('react-router-dom')

const Organization = (props) => {
    const [ statusMessage, setStatusMessage ] = useState('')
    const [ organizationName, setOrganizationName ] = useState('')
    const [ organizationAdmin, setOrganizationAdmin ] = useState('')
    const [ userId, setUserId ] = useState('')
    const [tasks, setTasks] = useState([])

    const url = window.location.search
    const organizationId = new URLSearchParams(url).get('id')
    const waitlistPath = '/waitlist?organizationId=' + organizationId
    const membersPath = `/members?organizationId=${organizationId}&adminId=${organizationAdmin}`

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = Object.fromEntries(new FormData(form).entries())

        const request = await postMethod(formData, `/api/organizations/invite?id=${organizationId}`)
        const requestData = request.data
        const { status, message } = requestData
        if(status == 200) {
            setStatusMessage('invitation sent')
        } else {
            setStatusMessage('Error, try aagain later')
        }
    }

    const updateTasks = (tasks) => {
        setTasks(tasks)
    }

    useEffect(async () => {
        
        if(!userId) {
            setUserId(localStorage.getItem('userId'))
        }

        try {
            const request = await getMethod(`/api/organizations/?id=${organizationId}`)
            setOrganizationName(request.data.message.name)
            setOrganizationAdmin(request.data.message.admin)
        } catch(err) {
            setOrganizationName('Loading..')
        }

        if(tasks.length < 1) {
            await getTasks()
        }
    })

    const showTaskCreateForm = () => {
        document.querySelector('#task_form').classList.toggle('hide')
    }

    const getTasks = async () => {
        const requestTasks = await getMethod('/api/organizations/tasks/?organizationId=' + organizationId)

        if(requestTasks.data.status == 200) {
            setTasks(requestTasks.data.message)
        }
    }
    
    return (
        <div className="container">
            <h1 className="organization_name">{organizationName}</h1>
            <p className="errorStatus_message">{statusMessage}</p>

            <div className="organization_header">

                {organizationAdmin == userId ? 
                        <NavLink to={waitlistPath}>WAITLIST</NavLink>
                    : 
                        ''
                }
                <NavLink to={membersPath}>Members</NavLink>


                    <button className="createTask_button" onClick={showTaskCreateForm}>+ Create task</button>
            </div>

            <TasksTable userId={props.userId} updateTasks={(tasks) => updateTasks(tasks)} tasks={tasks} />
            <TaskForm organizationId={organizationId} setTasks={(tasks) => {console.log(tasks); return(setTasks(tasks))}} />

            {userId == organizationAdmin ? 
                <form className="inviteUsers_form" onSubmit={handleFormSubmit}>
                    <label> Invite users: </label>
                    <input type="email" name="email" placeholder="Type their email address.." />
                    <input className="form_button inviteUsersForm_button" type="submit" value="send request" />
                </form>
            :
                ''
            }
        </div>
    )
}

export default Organization