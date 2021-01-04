import React, { useState } from 'react'
import { postMethod } from '../helpers/request'

const JoinOrganization = () => {
    const [ requestStatusMsg, setRequestStatusMsg ] = useState('')

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = Object.fromEntries(new FormData(form).entries())

        const request = await postMethod(formData, '/api/organizations/join')
        setRequestStatusMsg(request.data.message)
    }

    return(
        <div className="organizationForm_container">
            <div className="container_header">
                <h1>Join organization</h1>
                <p className="errorStatus_message">{requestStatusMsg}</p>
            </div>

            <form onSubmit={handleFormSubmit}>
                <div className="organizationForm_row">
                    <label> Type organization name: </label>
                    <input required type="text" placeholder="organization name" name="organizationName" />
                </div>
                <input className="button organizationForm_button" type="submit" value="send request" />
            </form>
        </div>
    )
}

export default JoinOrganization