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

module.exports = {
    invitationEmailTemplate
}