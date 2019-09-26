const mongoose = require('mongoose')
const config = require('../config')

module.exports = async () => {
    console.log(`MONGO!! >>>>>>> mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbHost}/photos?retryWrites=true&w=majority`)
    const connection = await mongoose.connect(`mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbHost}/photos?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true})
    // const connection = await mongoose.connect(`mongodb+srv://sbeard:Password123@step-rpznx.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true})
    return connection.connection.db
}
