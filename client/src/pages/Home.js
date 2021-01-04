import React, { useState, useEffect } from 'react'
import Button from '../components/Button'
const { getMethod, deleteMethod } = require('../helpers/request')
const { NavLink } = require('react-router-dom')

const Home = (props) => {
    const { userId } = props
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ invitations, setInvitations ] = useState('')

    useEffect(async () => {
        const getOrganizationsRequest = await getMethod('/api/users/my-organizations')
        const requestData = getOrganizationsRequest.data
        const requestStatus = requestData.status

        if(requestStatus != 200) {
            return setErrorMessage('something happened, please try again later')
        }

        setInvitations(requestData.message)
    }, [])

    const deleteOrganization = async (organizationId) => {
        const deleteOrganizationRequest = await deleteMethod(`/api/organizations/?id=${organizationId}`)

        if(deleteOrganizationRequest.data.status == 200) {
            document.getElementById('organization_' + organizationId).remove()
            setErrorMessage(deleteOrganizationRequest.data.message)
        } else {
            setErrorMessage(deleteOrganizationRequest.data.message)
        }
    }

    const displayJoinOrganizationForm = (event) => {
        event.preventDefault()
        document.querySelector('#joinOrganization_form').classList.toggle('hide')
    }

    return (
        <div className="container">
            <div className="homePage_header">
                <h1>ORGANIZATIONS</h1>
                <Button nodeClass="join_button" link='/join-organization' text='+ Join organization' />
            </div>
            <p>{ errorMessage }</p>

            <div className="allOrganizations_container">
                {
                    invitations.length > 0 ?
                    invitations.map(organization => {
                        const organizationName = organization.name
                        const organizationId= organization._id
                        const organizationAdmin = organization.admin
                        const userRole = organizationAdmin == userId ? 'admin' : 'member'
                        const organizationPath = '/organization?id=' + organizationId

                        return (
                            <div className="organization_container" id={'organization_' + organizationId}>
                                <NavLink to={organizationPath}>
                                    <h3>{organizationName}</h3>
                                    <p>Your role is - <span className="user_role">{userRole}</span></p>
                                    { userRole == 'admin' ? <button className="button deleteOrganization_button" onClick={() => deleteOrganization(organizationId)}>delete</button> : '' }
                                </NavLink>
                            </div>
                        )
                    })
                    : ''
                }
            </div>
            <br />
            <Button nodeClass="createOrganization_button" link='/create-organization' text='+ Create organization' />
        </div>
    )
}

export default Home