import React, { useState, useEffect } from 'react'
import CommentForm from './CommentForm'
const { getMethod, deleteMethod } = require('../helpers/request')

const Comments = (props) => {
    const [errorMsg, setErrorMsg] = useState('')
    const [comments, setComments] = useState([])

    useEffect(async () => {
        if(comments.length < 1) {
            console.log('update', props.taskId)
            getComments()
        } 
        console.log(comments)
    })

    const getComments = async () => {
        try{
            const commentsRequest = await getMethod(`/api/tasks/comments?taskId=${props.taskId}`)
            if(commentsRequest.data.status == 200) {
                //set comments
                //const comments = commentsRequest.data.message


                if(comments.length < 1) {
                    setComments(commentsRequest.data.message)
                }
            } else {
                setErrorMsg(commentsRequest.data.message)
            }
        } catch(err) {
            console.log(err)
            setErrorMsg('Error, try again later')
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const deleteCommentRequest = await deleteMethod(`/api/tasks/comments?taskId=${props.taskId}&commentId=${commentId}`)
            if(deleteCommentRequest.data.status == 200) {
                //set comments
                //const comments = deleteCommentRequest.data.message

                setComments(deleteCommentRequest.data.message)

            } else {
                setErrorMsg(deleteCommentRequest.data.message)
            }
        } catch(err) {
            setErrorMsg('Error, try again later')
        }
    }

    return (
        <div>
            <h6>Comments</h6>
            <CommentForm taskId={props.taskId} updateComments={(comments) => setComments(comments)} />

            <div>
                <p>{errorMsg}</p>

                {comments.map(comment => 
                    <div>
                        x
                        <p>{comment.text}</p>
                        <p>by: {comment.author}</p>
                        <button onClick={() => deleteComment(comment._id)}>delete comment</button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default Comments