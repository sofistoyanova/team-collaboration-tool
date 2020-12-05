import React, { useState } from 'react'
import { postMethod } from '../helpers/request'

const JoinOrganization = () => {
    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = new FormData(form)

        const request = await postMethod(formData, '/api/organization/join')
    }

    return(
        <div>
            <h1>Join organization</h1>

            <form onSubmit={handleFormSubmit}>
                <label> Type organization name: </label>
                <input type="text" placeholder="organization name" />
                <input type="submit" value="send request" />
            </form>
        </div>
    )
}

export default JoinOrganization