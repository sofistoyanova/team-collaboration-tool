import React, { useState, useEffect } from 'react'
import Comments from './Comments'
const { getMethod, patchMethod, deleteMethod } = require('../helpers/request')


const Task = (props) => {
    const [assignedUserName, setAssignedUser] = useState('')
    const [assignedUserImage, setAssignedUserImage] = useState('')

    const [creatorName, setCreator] = useState('')
    const [title, setTitle] = useState(props.title)
    const [description, setDescription] = useState(props.description)
    const [isUrgent, setIsUrgent] = useState(props.urgent)
    const [status, setStatus] = useState(props.status)
    const [taskId, setTaskId] = useState(props.id)
    const [organizationId, setOrganizationId] = useState(props.id)
    const [ errorMessage, setErrorMessage ] = useState('')


    useEffect(async () => {
        const url = window.location.search
        const organizationId = new URLSearchParams(url).get('id')
        setOrganizationId(organizationId)

        const assigneeId = props.assigneeId
        const creatorId = props.creatorId

        const getAssignedUser = await getMethod('/api/users/user?id=' + assigneeId)
        const getCreator = await getMethod('/api/users/user?id=' + creatorId)
        const assignedUser = getAssignedUser.data
        const creator = getCreator.data

        if(assignedUser.status == 200) {
            setAssignedUserImage(assignedUser.message.profileImage)
            setAssignedUser(assignedUser.message.firstName + ' ' + assignedUser.message.lastName)
        }

        if(creator.status == 200) {
            setCreator(creator.message.firstName + ' ' + creator.message.lastName)
        }
    }, [])

    const showTicket = (event) => {
        const parentNode = event.target.closest('.taskMain_container')
        const taskContainer = parentNode.querySelector('.task_container')

        Array.from(document.querySelectorAll('.task_container')).map(container => {
            container.classList.add('hide')
        })
        taskContainer.classList.toggle('hide')
    }

    const hideTask = (event) => {
        event.target.closest('.task_container').classList.add('hide')
    }

    const changeStaus = async (event) => {
        const statusValue = event.target.value
        // update ticket
        let updateTaskRequest = await patchMethod(`/api/tasks/?taskId=${taskId}&organizationId=${organizationId}`, {status: statusValue})
        // get new tickets array
        updateTaskRequest = updateTaskRequest.data

        if(updateTaskRequest.status != 200) {
            return setErrorMessage(updateTaskRequest.message)
        }

        const updatedTasks = updateTaskRequest.message
        if(updatedTasks.length > 0) {
            return props.updateTasks(updatedTasks)
        }

        setStatus(statusValue)
        const newStatus = event.target.value
    }

    const deleteTask = async () => {
        const deleteTaskRequest = await deleteMethod(`/api/tasks/?taskId=${taskId}&organizationId=${organizationId}`)

        if(deleteTaskRequest.data.status == 200) {
            return props.updateTasks(deleteTaskRequest.data.message)
        }

        return setErrorMessage(deleteTaskRequest.data.message)
    }

    return (
        <div className="taskMain_container">
            <div onClick={showTicket} className={isUrgent ? 'task-urgent table_row' : 'table_row'}>
                <div className="tableRow_content">
                    <img className="user_image" src={assignedUserImage ? require(`../uploads/${assignedUserImage}`).default : require(`../uploads/default.png`).default} />
                    <h4>{title ? title : errorMessage}</h4>
                </div>
                {isUrgent ? <span className="urgent_task">urgent</span> : ''}
            </div>
            <div className="task_container hide">

                <div onClick={hideTask} className="taskContainer_overlay"></div>
                
                <div className="taskContainer_content">
                    <span onClick={hideTask} className="btn-close">X</span>
                    <h4>{title}</h4>
                    <p>{description}</p>
                    
                    <div>
                        <div>
                            <span>Creator: </span>
                            <span>{creatorName}</span>
                        </div>

                        <div>
                            <span>Assigned: </span>
                            <span>{assignedUserName}</span>
                        </div>
                    </div>

                    <form onChange={changeStaus}>
                        <label>Change status</label>
                        <select value={status}>
                            <option value="in-progress">in progress</option>
                            <option value="in-review">in review</option>
                            <option value="finished">finished</option>
                        </select>
                    </form>

                    {props.userId == props.creatorId ? 
                            <button onClick={deleteTask}>delete task</button>
                        :
                        ''
                    }

                    <div>
                        <Comments taskId={taskId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Task