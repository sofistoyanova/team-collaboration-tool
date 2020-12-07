import React, { useState, useEffect } from 'react'
const { getMethod, postMethod, deleteMethod } = require('../helpers/request')


const Members = (props) => {       
    const { userId } = props 
    const [ statusMessage, setStatusMessage ] = useState('')
    const [ members, setMembers ] = useState([])
    const url = window.location.search
    const organizationId = new URLSearchParams(url).get('organizationId')

    useEffect(async () => {
        let getMembersRequest = await getMethod(`/api/organizations/members?organizationId=${organizationId}`)
        getMembersRequest = getMembersRequest.data

        if(getMembersRequest.status == 200) {
            setStatusMessage('')
            setMembers(getMembersRequest.message)
        } else {
            setStatusMessage(getMembersRequest.message)
        }
    }, [])

    const removeMember = async (memberId) => {
        let removeMemberRequest = await deleteMethod(`/api/organizations/member?organizationId=${organizationId}&memberId=${memberId}`)
        removeMemberRequest = removeMemberRequest.data

        if(removeMemberRequest.status == 200) {
            document.querySelector('#member_' + memberId).remove()
            setStatusMessage('successfully removed')
        } else {
            setStatusMessage(removeMemberRequest.message)
        }
    }

    return (
        <div>
            <h1>Members</h1>
            <p>{statusMessage}</p>

            <div>
                {
                    members.map(member => {
                        const { firstName, lastName, email } = member
                        const memberId = member._id

                        return (
                        <p id={'member_' + memberId} >{firstName} {lastName} - {email} {memberId == userId ? '(ADMIN)' : <button onClick={() => removeMember(memberId) }>remove</button>}</p>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Members