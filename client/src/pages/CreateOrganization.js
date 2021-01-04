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
        <div className="organizationForm_container">
            <div className="container_header">
                <h1>Create organization</h1>
                <p className="errorStatus_message">{statusMessage}</p>
            </div>
            {
                emails.map(email => {
                    return <div className="email_item">
                            <p>{ email }</p>
                            <button onClick={removeEmail} className="close_btn">X</button>
                        </div>
                })
            }
            <form onSubmit={handleFormSubmit}>
                <div className="createOrganizationForm_row">
                    <label> organization name: </label>
                    <input type="text" name="name" placeholder="organization name" />
                </div>
                <div id="showEmails"></div>

                <div className="createOrganizationForm_row">
                    <label>Invite people: </label>
                    <input id="email" name="email address" placeholder="Type your email..." type="email" />
                    <button className="addPerson_button" onClick={addEmail}>+ add</button>
                </div>
                <input className="button organizationForm_button" type="submit" value="create organization" />
            </form>
        </div>
    )
}

export default CreateOrganization