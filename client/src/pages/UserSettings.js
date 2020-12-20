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
            console.log('re', request)
            const requestResponseCode = requestResponseData.code
            const requestResponseMessage = requestResponseData.message
            
            setStatusMessage(requestResponseMessage)
        } else {
            setStatusMessage(formValidationStatus.message)
        }
    }
    return (
        <div>
            <h1>Change profile</h1>
            <div>
                <h2>Change password</h2>
                <form id="changePassword_form" onSubmit={changePassword}>
                    <p>{statusMessage}</p>
                    <div>
                        <label>Old password</label>
                        <input required type="password" name="oldPassword" />
                    </div>
                    <div>
                        <label>New password</label>
                        <input required type="password" name="newPassword" />
                    </div>
                    <div>
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