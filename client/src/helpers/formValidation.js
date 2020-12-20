export const userSignupValidation = (formData) => {
    // validate length
    // validate email
    // validate password if match and lengh, if contains at least one letter
    // return messgae
    formData = Object.fromEntries(formData.entries())

    let status = {}
    const { firstName, lastName, email, password, confirmedPassword } = formData
    console.log('validation', formData)
    const emailPattern = /^\S+@\S+\.\S+$/
    const emailPatternMatch = email.match(emailPattern)

    if(firstName.trim().length < 2 || lastName.trim().length < 2) {
        return status = {
            code: 400,
            message: 'First/Last name should contains at least 2 characters.'
        }
    }

    if(!emailPatternMatch) {
        return status = {
            code: 400,
            message: 'Email is not in correct format.'
        }
    }

    if(password.length < 7) {
        return status = {
            code: 400,
            message: 'Password should contains at least 7 characters.'
        }
    }

    if(password != confirmedPassword) {
        return status = {
            code: 400,
            message: 'Passwords do not match.'
        }
    }
    return status = {
        code: 200,
        message: 'Successfully registered!'
    }
}

export const userLoginValidation = (formData) => {
    const { email, password } =  formData
    const emailPattern = /^\S+@\S+\.\S+$/
    const emailPatternMatch = email.match(emailPattern)
    let status = {}

    if(!email || !password) {
        return status = {
            code: 400,
            message: 'Please fill in all user details'
        }
    }

    if(!emailPatternMatch) {
        return status = {
            code: 400,
            message: 'Email is invalid format'
        }
    }

    return status = {
        code: 200,
        message: ''
    }
}

export const changePasswordValidation = (formData) => {
    formData = Object.fromEntries(formData.entries())

    const { oldPassword, newPassword, confirmNewPassword } = formData
    let status = {
        code: 200,
        message: 'success'
    }

    if(newPassword !== confirmNewPassword) {
        return status = {
            code: 400,
            message: 'Password do not match'
        }
    }

    if(newPassword.length < 7) {
        return status = {
            code: 400,
            message: 'Password should contains at least 7 characters.'
        }
    }

    return status
}

export const emailValidation = (formData) => {
    const { email } = formData
    const emailPattern = /^\S+@\S+\.\S+$/
    const emailPatternMatch = email.match(emailPattern)
    let status = {
        code: 200,
        message: 'success'
    }

    if(!emailPatternMatch) {
        return status = {
            code: 400,
            message: 'email not valid'
        }
    }

    return status
}