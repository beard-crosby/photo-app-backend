const express = require('express')

// const config = require('./config')
// const Logger = require('./loaders/logger')


async function startServer() {
    const app = express()

    await require('./loaders').default(app)

    // app.listen(config.port, err => {
    app.listen(8082, err => {
        if (err) {
            console.log(err)
            process.exit(1)
            return
        }

        // Logger.info(`✅  Server listening on port: http://localhost:${config.port}`);
    })
}

startServer()
