import React, { useState, useEffect } from 'react'
import CommentForm from './CommentForm'
const { getMethod, deleteMethod } = require('../helpers/request')

const Comments = (props) => {
    const [errorMsg, setErrorMsg] = useState('')
    const [comments, setComments] = useState([])

    useEffect(async () => {
        if(comments.length < 1) {
            getComments()
        } 
    })

    const getComments = async () => {
        try{
            const commentsRequest = await getMethod(`/api/organizations/tasks/comments?taskId=${props.taskId}&organizationId=${props.organizationId}`)
            if(commentsRequest.data.status == 200) {
                if(comments.length < 1) {
                    setComments(commentsRequest.data.message)
                }
            } else {
                setErrorMsg(commentsRequest.data.message)
            }
        } catch(err) {
            setErrorMsg('Error, try again later')
        }
    }

    const deleteComment = async (commentId) => {
        try {
            const deleteCommentRequest = await deleteMethod(`/api/organizations/tasks/comments?taskId=${props.taskId}&commentId=${commentId}&organizationId=${props.organizationId}`)
            if(deleteCommentRequest.data.status == 200) {
                setComments(deleteCommentRequest.data.message)

            } else {
                setErrorMsg(deleteCommentRequest.data.message)
            }
        } catch(err) {
            setErrorMsg('Error, try again later')
        }
    }

    return (
        <div className="comments_container">
            <h3>Comments</h3>
            <CommentForm organizationId={props.organizationId} taskId={props.taskId} updateComments={(comments) => setComments(comments)} removeErrorMsg={() => setErrorMsg('')} />

            <div>
                <p>{errorMsg}</p>

                {comments.map(comment => 
                    <div className="comment_container">
                        <p>{comment.text}</p>
                        <p>by: {comment.author}</p>
                        <button className="deleteComment_button" onClick={() => deleteComment(comment._id)}>delete comment</button>
                    </div>
                )}
            </div>

        </div>
    )
}

export default Comments