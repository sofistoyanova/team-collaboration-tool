import React, { useState, useEffect } from 'react'
import { postMethod } from '../helpers/request'
import { emailValidation } from '../helpers/formValidation'
import backgrounImage from '../assets/signup-background.jpg'


const RequestPassword = (props) => {
    const [ statusMessage, setStatusMessage ] = useState('')

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        let formData = new FormData(document.querySelector('#requestNewPassowrd'))
        formData = Object.fromEntries(formData.entries())
        const formValidationStatus = emailValidation(formData)
        if(formValidationStatus.code == 200) {
            const request = await postMethod(formData, `/api/users/forgot-password`)
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
                <h1>Reset Password</h1>
                <div>
                    <form className="signup_form" id="requestNewPassowrd" onSubmit={handleFormSubmit}>
                        <div className="form_row">
                            <label>Type your email</label>
                            <input required type="email" name="email" placeholder="a@a.com" />
                        </div>
                        <p className="errorStatus_message">{statusMessage}</p>
                        <button className="form_row form_button" type="submit">send</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RequestPassword