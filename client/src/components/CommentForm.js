import React, { useState, useEffect } from 'react'
const { patchMethod } = require('../helpers/request')

const CommentForm = (props) => {
    const [errorMsg, setErrorMsg] = useState('')

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        let formData =  new FormData(form)
        formData = Object.fromEntries(formData.entries())
        const request = await patchMethod(`/api/tasks/comments?taskId=${props.taskId}`, formData)
        console.log('request form comment', request)
        const requestResponse = request.data.message
        console.log(request.data)
        if(request.data.status == 200 && requestResponse.length > 0) {
            //props.setComments(requestResponse)
            //setTasks(requestResponse)
            props.updateComments(requestResponse)
            props.removeErrorMsg()
            form.reset()
        } else {
            setErrorMsg('Please try again later')
        }
    }

    return (
        <form id="comment_form" onSubmit={handleFormSubmit}>
            <input type="textarea" name="comment" placeholder="Type your comment" />
            <input className="comment_button" type="submit" value="comment" />
        </form>
    )
}

export default CommentForm