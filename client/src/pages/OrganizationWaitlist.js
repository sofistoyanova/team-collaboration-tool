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
        
        // if success remove node
        if(sendResponse.data.status == 200) {
            document.getElementById(userId).remove()
        }
    }
  
    return (
        <div>
            <h1>Waitlist</h1>

            {
                requests.length > 0 ?
                requests.map(request => {
                    const { user } = request
                    const userId = user._id
                    const { firstName, lastName, email } = user
                    console.log(4, request)

                    return (
                        <div id={userId}>
                            <span>{firstName} {lastName} - {email}</span>
                            <button onClick={() => { respondToRequest('accept', userId) }}>accept</button>
                            <button onClick={() => { respondToRequest('reject', userId) }}>reject</button>
                            
                        </div>
                    )
                })
                : ''
            }
        </div>
    )
}

export default OrganizationWaitlist