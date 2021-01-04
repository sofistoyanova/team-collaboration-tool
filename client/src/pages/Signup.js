import React, { useState, useEffect } from 'react'
import { userSignupValidation } from '../helpers/formValidation'
import { postMethod } from '../helpers/request'
import backgrounImage from '../assets/signup-background.jpg'

const Signup = () => {
    const [ statusMessage, setStatusMessage ] = useState('')
    const [ file, setFile ] = useState('')

    useEffect(() => {
        if(window.localStorage.getItem('userId')) {
            window.location.replace("/")
        }
    })

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = document.querySelector('form')
        let formData = new FormData(form)
        const formValidationStatus = userSignupValidation(formData)

        if(formValidationStatus.code == '200') {
            const request = await postMethod(formData, '/api/users/signup')
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
                <h1>Welcome to the team!</h1>

                <form className="signup_form" onSubmit={handleFormSubmit}>
                    <div className="form_row">
                        <label>First name</label>
                        <input type="text" name="firstName" placeholder="First Name" />
                    </div>

                    <div className="form_row">
                        <label>Last name</label>
                        <input type="text" name="lastName" placeholder="Last Name" />
                    </div>

                    <div className="form_row">
                        <label>Email</label>
                        <input type="email" name="email" placeholder="a@a.com" />
                    </div>

                    <div className="form_row">
                        <label>Password </label>
                        <input type="password" name="password" />
                    </div>

                    <div className="form_row">
                        <label>Confirm Password </label>
                        <input type="password" name="confirmedPassword" />
                    </div>

                    <div className="form_row">
                        <label>Upload profile picture</label>
                        <input
                            name="profileImage"
                            type="file" 
                        />
                    </div>

                    <p className="errorStatus_message">{statusMessage}</p>
                    <button className="form_row form_button" type="submit">submit</button>
                </form>
            </div>
        </div>
    )
}

export default Signup