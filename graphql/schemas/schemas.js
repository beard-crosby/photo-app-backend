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
    allPosts: [Post!]!
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
    updateGeolocation(_id: ID!, geolocation: String!): User
    updateInfo(_id: ID!, info: String!): User
    updatePP(_id: ID!, profile_picture: String!): User
    updateStatus(_id: ID!, status: String!): User
    updateFavourites(_id: ID!, post: ID!, action: String!): User
    updateTitle(_id: ID!, title: String!): Post
    updateDescription(_id: ID!, description: String!): Post
    signS3(filename: String!, filetype: String!): S3Payload!
    redundantFilesCheck(_id: ID!): User
  }

  schema {
    query: rootQuery
    mutation: rootMutation
  }
`)