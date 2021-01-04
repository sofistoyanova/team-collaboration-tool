module.exports = {
    mongoURI: process.env.MONGO_URI,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    gmailEmail: process.env.GMAIL_EMAIL,
    gmailPassword: process.env.GMAIL_PASSWORD,
    saltedRounds: 10,
    cookieKey: process.env.COOKIE_KEY
}