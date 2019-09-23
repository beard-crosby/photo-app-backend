const dotenv = require('dotenv')

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const envFound = dotenv.config()
if (!envFound) {
    throw new Error("⚠️ Couldn't find .env file ⚠️")
}

module.exports = {

    // Server Port
    port: parseInt(process.env.PORT, 10),

    // Database
    databaseURL: process.env.MONGODB_URI,

    // JWT
    jwtsecret: process.env.JTW_SECRET,
}
