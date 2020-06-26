const express = require("express")
const mongoose = require("mongoose")
const graphqlHTTP = require("express-graphql")

// Import Graphql Schema and Resolvers.
const Schema = require("./graphql/schemas/schemas")
const Resolvers = require("./graphql/resolvers/resolvers")

// Import token authentication middleware.
const auth = require("./middleware/auth")

// Initialise express with Node.js
const app = express()
app.use(express.json())

// Handle CORS Errors.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST"
  )
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, accessToken, refreshToken")
  if (req.method === "OPTIONS") {
    return res.sendStatus(200)
  }
  next()
})

// Make token authentication middleware available in all reducers by passing req.
app.use(auth)

// Initialise Graphql with the /graphql endpoint.
app.use(
  "/graphql",
  graphqlHTTP({
    schema: Schema,
    rootValue: Resolvers,
    graphiql: true,
  })
)

// Error filters.
app.use((req, res, next) => {
  const err = new Error("URL Not Found")
  err.status = 404
  next(err)
})

// Connect to the MongoDB Atlas Database. If no port is specified in CLI use port 3001.
// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@photoapp-styay.mongodb.net/test?retryWrites=true&w=majority`, 
//   { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
//   .then(res => {
//     const PORT = process.env.PORT || 3001
//     app.listen(PORT, () =>
//       console.log(`[index.js] Server started on port ${PORT}]`)
//     )
//   })
//   .catch(err => {
//     console.log(err)
//   })

// Connect to a local MongoDB Database. If no port is specified in CLI use port 3001.
mongoose.connect(`mongodb://localhost:27017/photo-app`, 
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(res => {
    const PORT = process.env.PORT || 3001
    app.listen(PORT, () =>
      console.log(`[index.js] Server started on port ${PORT}]`)
    )
  })
  .catch(err => {
    console.log(err)
  })