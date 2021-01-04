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

        if(requestAssigneesStatus == 200) {
            setAssignees(users)
        }
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)
        const request = await postMethod(formData, '/api/organizations/tasks/?organizationId=' + props.organizationId)
        const requestResponse = request.data.message
        
        if(request.data.status == 200 && requestResponse.length > 0) {
            hideTaskForm()
            props.setTasks(requestResponse)
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
            <div className="taskForm_container taskPopup_container">
                <span onClick={hideTaskForm} className="btn-close">X</span>
                <h2>Create form</h2>
                <p>{errorMsg}</p>
                <form onSubmit={handleFormSubmit} method="POST" encType="multipart/form-data">
                    <div className="taskForm_row">
                        <label>Title:</label>
                        <input required type="text" name="title" placeholder="title" />
                    </div>

                    <div className="taskForm_row">
                        <label>Description:</label>
                        <textarea required name="description" placeholder="Description.." rows="4" cols="50" type="textarea"></textarea>
                    </div>

                    <div className="taskForm_row">
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

                    <div className="taskForm_row">
                        <label>Attach image</label>
                        <input name="media" type="file" />
                    </div>

                    <div className="taskForm_row">
                        <label>Deadline</label>
                        <input required name="deadline" type="date"></input>
                    </div>

                    <div className="taskForm_row">
                        <label>Does it prevent user from purchasing products?</label>
                        <select name="urgent">
                            <option value="no">no</option>
                            <option value="yes">yes</option>
                        </select>
                    </div>

                    <input className="button" type="submit" />
                </form>
            </div>
        </div>
    )
}

export default TaskForm