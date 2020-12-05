import React, { useState, useEffect } from 'react'
import { userLoginValidation } from '../helpers/formValidation'
import { postMethod } from '../helpers/request'
import { useHistory } from "react-router-dom";

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
        console.log(5)
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
            // redirect to home
            // set local storage cookie
            setLoginErrorMsg('success')
            const user = request.data.message
            const userId = user._id

            localStorage.setItem('userId', userId)
            history.push('/home')
        } else {
            console.log(1)
            // redirect
            // establish cookie/local storage
            setLoginErrorMsg(requestData.message)
        }
        
    }

    return (
        <div>
            <p>{loginErrorMsg}</p>
            <form onSubmit={handleFormSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="a@a.com"  />
                </div>

                <div>
                    <label>Password </label>
                    <input type="password" value="1234567" name="password" />
                </div>

                <input type="submit" />
            </form>
        </div>
    )
}

export default Login