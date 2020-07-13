const { buildSchema } = require("graphql")
const authSchema = require("./authSchema")
const postSchema = require("./postSchema")
const commentSchema = require("./commentSchema")
const miscSchema = require('./miscSchema')

module.exports = buildSchema(`
  ${authSchema}
  ${postSchema}
  ${commentSchema}
  ${miscSchema}

  type rootQuery {
    user(_id: ID!): User!
    posts(amount: Int!, iterations: Int): [[Post!]]!
    comment(_id: ID, post: ID, author: ID): Comment!
    allComments: [Comment!]!
    login(email: String!, password: String, oAuthToken: String): User!
    invalidateTokens: User
  }

  type rootMutation {
    createUser(userInput: userInput): User
    deleteUser: User
    createPost(postInput: postInput): Post
    deletePost(_id: ID!): Post
    createComment(post: ID!, comment: String!): Comment
    deleteComment(_id: ID!): Comment
    updateBasic(name: String, email: String, website: String): User
    updateSettings(settings: String!): User
    updateGeolocation(geolocation: String!): User
    updateInfo(info: String!): User
    updatePP(profile_picture: String!): User
    updateFavourites(post: ID!, action: String!): User
    updateStatus(status: String!): User
    updateTitle(_id: ID!, title: String!): Post
    updateDescription(_id: ID!, description: String!): Post
    signS3(filename: String!, filetype: String!): S3Payload!
    redundantFilesCheck: User
  }

  schema {
    query: rootQuery
    mutation: rootMutation
  }
`)