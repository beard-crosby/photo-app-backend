const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// const morgan = require('morgan')

// const routes = require('../routes')
// const config = require('../config')

/**
 * Health Checks
 */
module.exports = app => {
    app.get('/status', (req, res) => {
        res.send("Hello")
    })

    // Load up CORS
    app.use(cors())

    // // Log API calls in the terminal.
    // app.use(morgan('dev'))

    // Transform raw strings to JSON in req.body
    app.use(bodyParser.json())

    // // Load Routes
    // app.use(config.api.prefix, routes())

    // // Catch 404 and forward to errors.
    // app.use((req, res, next) => {
    //     const err = new Error('Not Found')
    //     err['status'] = 404
    //     next(err)
    // })

    // // Error handlers
    // app.use((err, req, res, next) => {
    //     /**
    //      * Handle 401 thrown by express-jwt library
    //      */
    //     if (err.name === 'UnauthorizedError') {
    //         return res
    //             .status(err.status)
    //             .send({ message: err.message })
    //             .end()
    //     }
    //     return next(err)
    // })
    // app.use((err, req, res, next) => {
    //     res.status(err.status || 500)
    //     res.json({
    //         errors: {
    //             message: err.message,
    //         },
    //     })
    // })
}
