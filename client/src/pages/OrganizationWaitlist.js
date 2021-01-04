import React, { useState, useEffect } from 'react'
const { getMethod, postMethod } = require('../helpers/request')


const OrganizationWaitlist = () => {
    const [ requests, setRequests ] = useState([])
    const url = window.location.search
    const organizationId = new URLSearchParams(url).get('organizationId')

    useEffect(async () => {

        let getRequests = await getMethod(`/api/notifications/?role=organization&organizationId=${organizationId}`)
        getRequests = getRequests.data
        const requestStatus = getRequests.status

        if(requestStatus == 200) {
            setRequests(getRequests.notifications)
        }
    }, [])

    const respondToRequest = async (action, userId) => {
        const sendResponse = await postMethod({ action, userId, organizationId }, `/api/organizations/request-respond`)
        
        if(sendResponse.data.status == 200) {
            document.getElementById(userId).remove()
        }
    }
  
    return (
        <div className="waitlist_container container">
            <h1 className="waitlist_title">Waitlist</h1>

            <div className="membersList_container">
                <p>Users waiting for answers:</p>
                {
                    requests.length > 0 ?
                    requests.map(request => {
                        const { user } = request
                        const userId = user._id
                        const { firstName, lastName, email } = user

                        return (
                            <div className="waitlist_row" id={userId}>
                                <span>{firstName} {lastName} - {email}</span>
                                <button className="waitlist_button" onClick={() => { respondToRequest('accept', userId) }}>accept</button>
                                <button className="waitlist_button" onClick={() => { respondToRequest('reject', userId) }}>reject</button>
                                
                            </div>
                        )
                    })
                    : ''
                }
            </div>
        </div>
    )
}

export default OrganizationWaitlist