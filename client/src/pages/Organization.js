import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
const { getMethod, postMethod } = require('../helpers/request')

const Organization = () => {
    const [ statusMessage, setStatusMessage ] = useState('')
    const url = window.location.search
    const organizationId = new URLSearchParams(url).get('id')

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = Object.fromEntries(new FormData(form).entries())

        const request = await postMethod(formData, `/api/organizations/invite?id=${organizationId}`)
        const requestData = request.data
        const { status, message } = requestData
        console.log(requestData, status)
        if(status == 200) {
            setStatusMessage('invitation sent')
        } else {
            setStatusMessage('Error, try aagain later')
        }
    }
    
    return (
        <div>
            <h1>Organization page</h1>

            <div>
                <p>{statusMessage}</p>
                <form onSubmit={handleFormSubmit}>
                    <label> Type user email you want to invite: </label>
                    <input type="email" name="email" placeholder="a@a.com" />
                    <input type="submit" value="send request" />
                </form>
            </div>
        </div>
    )
}

export default Organization