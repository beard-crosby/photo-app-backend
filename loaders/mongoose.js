const mongoose = require('mongoose')
const config = require('../config')

module.exports = async () => {
    const connection = await mongoose.connect(`mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbHost}/photos?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true})
    console.log(`MongoDB Database Connected`)
    return connection.connection.db
}
