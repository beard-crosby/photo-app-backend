const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const graphqlHTTP =require("express-graphql")

const graphQLSchema = require('../schema')
const graphQLResolvers = require('../resolvers')

const auth = require('../middleware/auth')

// const routes = require('../routes')
const config = require('../config')

module.exports = app => {
    // Load up CORS
    app.use(cors())

    app.get('/status', (req, res) => {
        res.send('Hello')
    })

    app.get('/', (req, res) => {
        res.send('Umm... What are you doing here? There is nothing for you to see here.')
    })

    // Transform raw strings to JSON in req.body
    app.use(bodyParser.json())

    // Use our auth middleware
    app.use(auth)

    app.use(
        '/graphql',
        graphqlHTTP({
            schema: graphQLSchema,
            rootValue: graphQLResolvers,
            graphiql: true,
        })
    )

    // // Log API calls in the terminal.
    app.use(morgan('dev'))


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
