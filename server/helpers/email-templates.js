const invitationEmailTemplate = (email, organizationName) => {
    return {
        from: organizationName,
        to: email,
        subject: 'Invitation to join our organization',
        html: `
            <p>Welcome ${email}</p>
            <p>You are welcome to join ${organizationName}</p>
            <p>Follow the link:</p>
            <a href="http://localhost:3000/">website link</a>
        `
    }
}

const taskAlertTemplate = (email, organizationName, ticketTitle) => {
    return {
        from: organizationName,
        to: email,
        subject: 'Invitation to join our organization',
        html: `
            <p>Hi ${email}</p>
            <p>You are assign to ticket - ${ticketTitle}</p>
            <p>Tagged with urgen. Please take a look soon!</p>
        `
    }
}

const resetPasswordTemplate = (email, url) => {
    return {
        from: 'Collaboration tool website',
        to: email,
        subject: 'Reset password',
        html: `
            <p>Hi ${email}</p>
            <p>You have requested new password. Please follow the link</p>
            <a href="${url}">${url}</a>
        `
    }
}

module.exports = {
    invitationEmailTemplate,
    taskAlertTemplate,
    resetPasswordTemplate
}