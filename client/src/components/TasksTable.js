import React, { useState, useEffect } from 'react'
import Task from './Task'

const TasksTable = (props) => {
    const [unfinishedTasks, setUnfinishedTasks] = useState([])
    const [underReviewTasks, setUnderReviewTasks] = useState([])
    const [finishedTasks, setFinishedTasks] = useState([])

    useEffect(() => {
        console.log('task table ', props.tasks)
        const unFinishedTasksArr = []
        const underReviewTasksArr = []
        const finishedTasksArr = []
        // organize tasks
        props.tasks.map((task) => {
            //console.log('task', task)
            const { title, description, status, urgent, deadline, createdAt, media } = task
            const assigneeId = task.assignee
            const creatorId = task. creator
            const taskComponent = <Task setTasks={(tasks) => props.setTasks(tasks)} title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />

            if(status === 'in-progress') {
                unFinishedTasksArr.push(task)

                // check last element date
                // compare last element deadline with current task deadline
                // if current task deadline is closer to current date move in front
            } else if(status === 'in-review') {
                underReviewTasksArr.push(task)
            } else if(status === 'finished') {
                finishedTasksArr.push(task)
            }
        })

        console.log('unsorted', unFinishedTasksArr)
        unFinishedTasksArr.sort((a, b) => {
            if (b.urgent) {
                return 1
            } else if(a.urgent) {
                return -1
            } else {
                const dateA = new Date(a.deadline)
                const dateB = new Date(b.deadline)
                return dateA - dateB
            }
        })

        unFinishedTasksArr.sort((a, b) => {
            console.log(a.urgent, b.urgent)

            if(a.urgent && b.urgent) {
                const dateA = new Date(a.deadline)
                const dateB = new Date(b.deadline)
                return dateA - dateB
            } else {
                return 0
            }
        })

        setUnfinishedTasks(unFinishedTasksArr)
        setUnderReviewTasks(underReviewTasksArr)
        setFinishedTasks(finishedTasksArr)
    }, [props])

    const getUserName = async () => {

    }

    return (
        <div className="tasks_table">
            <div className="tasksTable_colum">
                <h3 className="tasksTableColumn_header">Task</h3>
                {/* with deadline */}
                <div className="tasks_container">
                    {unfinishedTasks.map(task => {
                        const { title, description, status, urgent, deadline, createdAt, media } = task
                        const assigneeId = task.assignee
                        const creatorId = task. creator
                        const taskId = task._id

                        return <Task userId={props.userId} column='in-progress' id={taskId} updateTasks={(tasks) => props.updateTasks(tasks)} title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />
                    })}
                </div>
            </div>

            <div className="tasksTable_colum">
                <h3 className="tasksTableColumn_header">Under Review</h3>
                <div className="tasks_container">
                    {underReviewTasks.map(task => {
                        const { title, description, status, urgent, deadline, createdAt, media } = task
                        const assigneeId = task.assignee
                        const creatorId = task. creator
                        const taskId = task._id
                        
                        return <Task userId={props.userId} column='in-review' id={taskId} updateTasks={(tasks) => props.updateTasks(tasks)} title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />
                    })}
                </div>
            </div>

            <div className="tasksTable_colum">
                <h3 className="tasksTableColumn_header">Finished</h3>
                <div className="tasks_container">
                    {finishedTasks.map(task => {
                        const { title, description, status, urgent, deadline, createdAt, media } = task
                        const assigneeId = task.assignee
                        const creatorId = task. creator
                        const taskId = task._id
                        
                        return <Task userId={props.userId} id={taskId} updateTasks={(tasks) => props.updateTasks(tasks)} title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default TasksTable