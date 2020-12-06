import React, { useState } from 'react'
import { postMethod } from '../helpers/request'

const JoinOrganization = () => {
    const [ requestStatusMsg, setRequestStatusMsg ] = useState('')

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = Object.fromEntries(new FormData(form).entries())

        const request = await postMethod(formData, '/api/organizations/join')
        console.log(request.data.message)
        setRequestStatusMsg(request.data.message)
    }

    return(
        <div>
            <h1>Join organization</h1>
            <p>{requestStatusMsg}</p>

            <form onSubmit={handleFormSubmit}>
                <label> Type organization name: </label>
                <input required type="text" placeholder="organization name" name="organizationName" />
                <input type="submit" value="send request" />
            </form>
        </div>
    )
}

export default JoinOrganization