import React, { useState, useEffect } from 'react'
import { userLoginValidation } from '../helpers/formValidation'
import { postMethod } from '../helpers/request'
import { useHistory } from "react-router-dom";
import backgrounImage from '../assets/signup-background.jpg'
const { NavLink } = require("react-router-dom")

const Login = () => {
    const [ loginErrorMsg, setLoginErrorMsg ] = useState('')
    let history = useHistory()

    useEffect(() => {
        if(window.localStorage.getItem('userId')) {
            window.location.replace("/")
        }
    })

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = document.querySelector('form')
        let formData = Object.fromEntries(new FormData(form).entries())
        const formValidation = userLoginValidation(formData)
        const formValidationStatus = formValidation.code

        if(formValidationStatus != 200) {
            return setLoginErrorMsg(formValidation.message)
        }

        const request = await postMethod(formData, '/api/users/login')
        const requestData = request.data

        if(requestData.status == 200) {
            setLoginErrorMsg('success')
            const user = request.data.message
            const userId = user._id

            localStorage.setItem('userId', userId)
            history.push('/home')
        } else {
            setLoginErrorMsg(requestData.message)
        }
    }

    return (
        <div className="signupFormOuter_container">
            <img className="background_image" src={backgrounImage} />
            
            <div className="signupForm_container">
                <h1>LOGIN</h1>
                <a href="/api/users/auth/google" className="">Use Google Account Instead?</a>

                <form className="login_form" onSubmit={handleFormSubmit}>
                    <div className="form_row">
                        <label>Email:</label>
                        <input type="email" name="email" placeholder="a@a.com"  />
                    </div>

                    <div className="form_row">
                        <label>Password: </label>
                        <input type="password" name="password" />
                    </div>
                    
                    <p className="errorStatus_message">{loginErrorMsg}</p>  
                    <button className="form_row form_button" type="submit">submit</button>
                </form>
                <NavLink to="/request-new-password">Forgot password? Clikc here!</NavLink>
                </div>
        </div>
    )
}

export default Login