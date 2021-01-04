import React, { useState, useEffect } from 'react'
import { patchMethod } from '../helpers/request'
import { changePasswordValidation } from '../helpers/formValidation'


const UserSettings = (props) => {
    const [ statusMessage, setStatusMessage ] = useState('')

    const changePassword = async (event) => {
        event.preventDefault()
        const formData = new FormData(document.querySelector('#changePassword_form'))
        const formValidationStatus = changePasswordValidation(formData)
        
        if(formValidationStatus.code == 200) {
            const request = await patchMethod(`/api/users/?id=${props.userId}`, Object.fromEntries(formData.entries()))
            const requestResponseData = request.data
            const requestResponseCode = requestResponseData.code
            const requestResponseMessage = requestResponseData.message
            
            setStatusMessage(requestResponseMessage)
        } else {
            setStatusMessage(formValidationStatus.message)
        }
    }
    return (
        <div className="organizationForm_container">

        <div className="container_header">
        <h1>Change password</h1>
        <p className="errorStatus_message">{statusMessage}</p>
        </div>

        <div>
            <form id="changePassword_form" onSubmit={changePassword}>
                <div className="createOrganizationForm_row">
                    <label>Old password</label>
                    <input required type="password" name="oldPassword" />
                </div>
                <div className="createOrganizationForm_row">
                    <label>New password</label>
                    <input required type="password" name="newPassword" />
                </div>
                <div className="createOrganizationForm_row">
                    <label>Confrim new password</label>
                    <input required type="password" name="confirmNewPassword" />
                </div>

                <input type="submit" value="change" />
            </form>
        </div>
        </div>
    )
}

export default UserSettings