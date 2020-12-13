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
            const taskComponent = <Task title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />

            if(status === 'unfinished') {
                unFinishedTasksArr.push(task)

                // check last element date
                // compare last element deadline with current task deadline
                // if current task deadline is closer to current date move in front
            } else if(status === 'underReview') {
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

    // var myArray = [{
    //     name: "Joe Blow",
    //     date: "Mon Oct 31 2016 00:00:00 GMT-0700 (PDT)",
    //     flag: false
    //   }, {
    //     name: "Sam Snead",
    //     date: "Sun Oct 30 2016 00:00:00 GMT-0700 (PDT)",
    //     flag: true
    //   }, {
    //     name: "John Smith",
    //     date: "Sat Oct 29 2016 00:00:00 GMT-0700 (PDT)",
    //     flag: false
    //   }];
      
    //   myArray.sort(function compare(a, b) {
    //     var dateA = new Date(a.flag);
    //     var dateB = new Date(b.flag);

    //     if(!b.flag) {
    //         return -1
    //     } else {
    //         return 1
    //     }
    //   });
      
      //console.log('myarray', myArray);

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

                        return <Task title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />
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
                        
                        return <Task title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />
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
                        
                        return <Task title={title} description={description} status={status} urgent={urgent} deadline={deadline} createdAt={createdAt} media={media} assigneeId={assigneeId} creatorId={creatorId} />
                    })}
                </div>
            </div>
        </div>
    )
}

export default TasksTable