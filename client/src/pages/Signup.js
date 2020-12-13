import React, { useState, useEffect } from 'react'
import { userSignupValidation } from '../helpers/formValidation'
import { postMethod } from '../helpers/request'

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

        console.log('form', formValidationStatus)

        //file
        console.log(file)

        if(formValidationStatus.code == '200') {
            // send to DB
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
        <div>
            <h1>Welcome to my chat app</h1>

            <form onSubmit={handleFormSubmit}>
                <p>{statusMessage}</p>
                <div>
                    <label>First name</label>
                    <input type="text" name="firstName" placeholder="First Name" />
                </div>

                <div>
                    <label>Last name</label>
                    <input type="text" name="lastName" placeholder="Last Name" />
                </div>

                <div>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="a@a.com" />
                </div>

                <div>
                    <label>Password </label>
                    <input type="password" value="1234567" name="password" />
                </div>

                <div>
                    <label>Confirm Password </label>
                    <input type="password" value="1234567" name="confirmedPassword" />
                </div>

                <div>
                    <label>Upload profile picture</label>
                    <input
                        name="profileImage"
                        type="file" 
                    />
                </div>

                <input type="submit" />
            </form>
        </div>
    )
}

export default Signup