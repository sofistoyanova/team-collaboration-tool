import React, { useState, useEffect } from 'react'
const { getMethod } = require('../helpers/request')


const Task = (props) => {
    const showTicket = (event) => {
        const parentNode = event.target.closest('.taskMain_container')
        const taskContainer = parentNode.querySelector('.task_container')
        //console.log(taskContainer)
        // close all
        Array.from(document.querySelectorAll('.task_container')).map(container => {
            container.classList.add('hide')
        })
        taskContainer.classList.toggle('hide')
    }

    const hideTask = (event) => {
        event.target.closest('.task_container').classList.add('hide')
    }

    return (
        <div className="taskMain_container">
            <div onClick={showTicket} className={props.urgent ? 'task-urgent' : ''}>
                <h4>{props.title}</h4>
            </div>
            <div className="task_container hide">

                <div onClick={hideTask} className="taskContainer_overlay"></div>
                
                <div className="taskContainer_content">
                    <span onClick={hideTask} className="btn-close">X</span>
                    <h4>{props.title}</h4>
                    <p>{props.description}</p>
                </div>
            </div>
        </div>
    )
}

export default Task