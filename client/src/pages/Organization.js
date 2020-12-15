import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import TasksTable from '../components/TasksTable'
import TaskForm from '../components/TaskForm'
const { getMethod, postMethod } = require('../helpers/request')
const { NavLink } = require('react-router-dom')

const Organization = () => {
    const [ statusMessage, setStatusMessage ] = useState('')
    const [ organizationName, setOrganizationName ] = useState('')
    const [tasks, setTasks] = useState([])

    const url = window.location.search
    const organizationId = new URLSearchParams(url).get('id')
    const waitlistPath = '/waitlist?organizationId=' + organizationId
    const membersPath = '/members?organizationId=' + organizationId

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
        console.log('tasks updated')
        try {
            console.log('set name')
            const request = await getMethod(`/api/organizations/?id=${organizationId}`)
            setOrganizationName(request.data.message)
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
        const requestTasks = await getMethod('/api/tasks/?organizationId=' + organizationId)
        //console.log('request', requestTasks)
        if(requestTasks.data.status == 200) {
            //setTasks(requestTasks.data.message)
            setTasks(requestTasks.data.message)
        }
    }

    // const requestTasks = (tasks) => {

    // }
    
    return (
        <div>
            <h1>Organization page - {organizationName}</h1>
            <NavLink to={waitlistPath}>waiting requests</NavLink>
            <NavLink to={membersPath}>Members</NavLink>
            <div>
                <p>{statusMessage}</p>
                <form onSubmit={handleFormSubmit}>
                    <label> Type user email you want to invite: </label>
                    <input type="email" name="email" placeholder="a@a.com" />
                    <input type="submit" value="send request" />
                </form>

                <button onClick={showTaskCreateForm}>Create task</button>
                    {console.log('task table take', tasks)}
                <TasksTable updateTasks={(tasks) => updateTasks(tasks)} tasks={tasks} />
                <TaskForm organizationId={organizationId} setTasks={(tasks) => setTasks(tasks)} />
            </div>
        </div>
    )
}

export default Organization