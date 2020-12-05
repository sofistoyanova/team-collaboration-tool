import React, { useState } from 'react'
import { postMethod } from '../helpers/request'
import validator from 'validator'

const CreateOrganization = () => {
    const [ statusMessage, setStatusMessage ] = useState('')
    const [ emails, setEmails ] = useState([])

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const form = event.target
        const formData = Object.fromEntries(new FormData(form).entries())
        formData.emails = emails
        console.log('k',formData)
        const request = await postMethod(formData, '/api/organizations/')
        const requestResponse = request.data.message
        setStatusMessage(requestResponse)
    }

    const addEmail = (event) => {
        event.preventDefault()
        const emailInput = document.querySelector('#email')
        const email = emailInput.value
        
        if(!validator.isEmail(email)) {
            return setStatusMessage('please add valid emaill')
        }

        setStatusMessage('')

        if(emails.includes(email)) {
            return setStatusMessage('email already added')
        }
        setEmails([...emails, email])
    }

    const removeEmail = (event) => {
        event.preventDefault()
        const  emailItem = event.target.parentNode
        const emailValue = emailItem.querySelector('p').innerHTML

        const filteredArray = emails.filter((email) => {
            return email != emailValue
        })

        setEmails([...filteredArray])
    }

    return(
        <div>
            <h1>create organization</h1>
            <p>{ statusMessage }</p>
            {
                emails.map(email => {
                    return <div className="email_item">
                            <p>{ email }</p>
                            <button onClick={removeEmail} className="close_btn">X</button>
                        </div>
                })
            }
            <form onSubmit={handleFormSubmit}>
                <label> organization name: </label>
                <input type="text" name="name" placeholder="organization name" />
                <div>
                    <div id="showEmails"></div>
                    <input id="email" name="email address" type="email" />
                    <button onClick={addEmail}>invite person</button>
                </div>
                <input type="submit" value="create organization" />
            </form>
        </div>
    )
}

export default CreateOrganization