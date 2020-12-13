import React, { useState, useEffect } from 'react'
const { getMethod, postMethod } = require('../helpers/request')

const Notifications = () => {
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ invitations, setInvitations ] = useState('')

    useEffect(async () => {
        const getInvitationsRequest = await getMethod('/api/users/invitations')
        const getInvitationsRequestData = getInvitationsRequest.data
        const getInvitationsRequestStatus = getInvitationsRequestData.status
        
        if(getInvitationsRequestStatus != 200) {
            setErrorMessage('There was an error retrieving all invtiations, plese try again later')
        }

        setInvitations(getInvitationsRequestData.message)
    }, [])

  

    const sendAnswer = async (event, organizationId, action) => {
        event.preventDefault()
        const sendAnswerRequest = await postMethod({
            organizationId: organizationId,
            action: action
        }, '/api/users/invitations')
        
        const sendAnswerRequestStatus = sendAnswerRequest.data.status

        if(sendAnswerRequestStatus == 200) {
            document.querySelector(`#invitation_${organizationId}`).remove()
        }
    }
    console.log(invitations)
    return (
        <div>
            <h1>Your Notifications:</h1>
            <p>{ errorMessage }</p>
            <div id="invitations">
                {
                    invitations.length > 0 ?
                    invitations.map(organization => {
                        const organizationName = organization.name
                        const organizationId= organization._id

                        return (
                            <div id={'invitation_' + organizationId}>
                                <p>{organizationName}</p>
                                <button onClick={(event) => {sendAnswer(event, organizationId, 'accept')}}>accept</button>
                                <button onClick={(event) => {sendAnswer(event, organizationId, 'decline')}}>decline</button>
                            </div>
                        )
                    })
                    : 'no invitations'
                }
            </div>
        </div>
    )
}

export default Notifications