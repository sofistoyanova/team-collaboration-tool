import React, { useState, useEffect } from 'react'
const { getMethod, postMethod, deleteMethod } = require('../helpers/request')


const Members = (props) => {       
    const { userId } = props 
    const [ statusMessage, setStatusMessage ] = useState('')
    const [ organizationAdmin, setOrganizationAdmin ] = useState('')
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

        if(!organizationAdmin) {
            setOrganizationAdmin(new URLSearchParams(url).get('adminId'))
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
        <div className="container members_container">
            <h1>Members List:</h1>
            <div className="membersList_container">
                <p>{statusMessage}</p>

                <div>
                    {
                        members.map(member => {
                            const { firstName, lastName, email } = member
                            const memberId = member._id

                            return (
                                <div>
                                    <p id={'member_' + memberId} >{firstName} {lastName} - {email} {memberId == organizationAdmin ? '(ADMIN)' : ''}</p>
                                    {userId == organizationAdmin && memberId != organizationAdmin ? 
                                        <button onClick={() => removeMember(memberId) }>remove</button>
                                    : 
                                        ''    
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Members