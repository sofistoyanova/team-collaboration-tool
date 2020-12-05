import React, { useState, useEffect } from 'react'
import Button from '../components/Button'
const { getMethod } = require('../helpers/request')
const { NavLink } = require("react-router-dom")

const Home = (props) => {
    const { userId } = props
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ invitations, setInvitations ] = useState('')

    useEffect(async () => {
        const getOrganizationsRequest = await getMethod('/api/users/my-organizations')
        const requestData = getOrganizationsRequest.data
        const requestStatus = requestData.status
        console.log(requestData)
        if(requestStatus != 200) {
            return setErrorMessage('something happened, please try again later')
        }

        setInvitations(requestData.message)
    }, [])

    const deleteOrganization = (organizationId) => {
        console.log(organizationId)
    }

    return (
        <div>
            <h1>Home page</h1>
            <div>
                <h1>MY ORGANIZATIONS:</h1>
                <p>{ errorMessage }</p>
                {
                    invitations.length > 0 ?
                    invitations.map(organization => {
                        const organizationName = organization.name
                        const organizationId= organization._id
                        const organizationAdmin = organization.admin
                        const userRole = organizationAdmin == userId ? 'admin' : 'member'
                        const organizationPath = '/organization?id=' + organizationId

                        return (
                            <div id={'invitation_' + organizationId}>
                                <NavLink to={organizationPath}>{organizationName} , role: {userRole}</NavLink>
                                { userRole == 'admin' ? <button onClick={() => deleteOrganization(organizationId)}>delete</button> : '' }
                            </div>
                        )
                    })
                    : ''
                }
            </div>
            <Button link='/join-organization' text='Join organization' />
            <br />
            <Button link='/create-organization' text='Create organization' />
        </div>
    )
}

export default Home