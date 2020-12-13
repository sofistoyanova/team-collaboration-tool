import React, { useState, useEffect } from 'react'
const { getMethod, postMethod } = require('../helpers/request')

const TaskForm = (props) => {
    const [ assignees, setAssignees ] = useState([])
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(async () => {
        if(assignees.length < 1) {
            await getAssignees()
        }
    }, )

    const getAssignees = async () => {
        const requestAssignees = await getMethod('/api/organizations/assignees?organizationId=' + props.organizationId)
        const requestAssigneesStatus = requestAssignees.data.status
        const users = requestAssignees.data.message
        console.log(requestAssignees.data)
        if(requestAssigneesStatus == 200) {
            setAssignees(users)
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)
        const request = await postMethod(formData, '/api/tasks/?organizationId=' + props.organizationId)
        const requestResponse = request.data.message
        
        if(request.data.status == 200 && requestResponse.length > 0) {
            hideTaskForm()
            props.setTasks(requestResponse)
            //setTasks(requestResponse)
        } else {
            setErrorMsg('Please try again later')
        }
    }

    const hideTaskForm = () => {
        document.querySelector('#task_form').classList.toggle('hide')
    }

    return (
        <div id="task_form" className="hide">
            <div onClick={hideTaskForm} className="taskForm_overlay"></div>
            <div className="taskForm_container">
                <h2>Create form</h2>
                <p>{errorMsg}</p>
                <form onSubmit={handleFormSubmit} method="POST" encType="multipart/form-data">
                    <div>
                        <label>Title:</label>
                        <input required type="text" name="title" placeholder="title" />
                    </div>

                    <div>
                        <label>Description:</label>
                        <input required name="description" placeholder="Description.." type="textarea" />
                    </div>

                    <div>
                        <label>Assign:</label>
                        <select required name="assignee">
                            {assignees.map(assignee => {
                                const userId = assignees._id
                                const { firstName, lastName, email } = assignee
                                
                                return (
                                    <option value={userId}>{firstName} {lastName} - {email}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div>
                        <label>Attach image</label>
                        <input name="media" type="file" />
                    </div>

                    <div>
                        <label>Deadline</label>
                        <input name="deadline" type="date"></input>
                    </div>

                    <div>
                        <label>Does it prevent user from purchasing products?</label>
                        <select name="urgent">
                            <option value="no">no</option>
                            <option value="yes">yes</option>
                            <option value="other">other</option>
                        </select>
                    </div>

                    <input type="submit" />
                </form>
            </div>
        </div>
    )
}

export default TaskForm