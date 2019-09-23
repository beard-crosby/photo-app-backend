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
    dbHost: process.env.DB_HOST,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,

    // JWT
    jwtsecret: process.env.JTW_SECRET,
}
