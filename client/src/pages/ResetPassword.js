import React, { useState, useEffect } from 'react'
import { patchMethod } from '../helpers/request'
import { changePasswordValidation } from '../helpers/formValidation'
import backgrounImage from '../assets/signup-background.jpg'

const ResetPassword = (props) => {
    const [ statusMessage, setStatusMessage ] = useState('')

    const changePassword = async (event) => {
        event.preventDefault()
        let formData = new FormData(document.querySelector('#changePassword_form'))
        const formValidationStatus = changePasswordValidation(formData)
        const url = window.location.search
        const token = new URLSearchParams(url).get('token')
        const email = new URLSearchParams(url).get('email')

        if(formValidationStatus.code == 200) {
            formData = Object.fromEntries(formData.entries()) 
            const request = await patchMethod(`/api/users/reset-password?email=${email}&token=${token}`, formData)
            const requestResponseData = request.data
            const requestResponseCode = requestResponseData.code
            const requestResponseMessage = requestResponseData.message
            
            setStatusMessage(requestResponseMessage)
        } else {
            setStatusMessage(formValidationStatus.message)
        }
    }
    return (
        <div className="signupFormOuter_container">
            <img className="background_image" src={backgrounImage} />

            <div className="signupForm_container">
                <h1>Change password</h1>

                <form className="login_form" id="changePassword_form" onSubmit={changePassword}>
                    <div className="form_row">
                        <label>New password</label>
                        <input required type="password" name="newPassword" />
                    </div>
                    <div className="form_row">
                        <label>Confrim new password</label>
                        <input required type="password" name="confirmNewPassword" />
                    </div>

                    <p className="errorStatus_message">{statusMessage}</p>
                    <button className="form_row form_button" type="submit">change</button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword