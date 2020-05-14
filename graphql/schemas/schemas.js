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
    allUsers: [User!]!
    post(_id: ID, author: ID): Post!
    allPosts: [Post!]!
    comment(_id: ID, post: ID, author: ID): Comment!
    allComments: [Comment!]!
    login(email: String, username: String, password: String!): User!
  }

  type rootMutation {
    signS3(filename: String!, filetype: String!): S3Payload!
    createUser(userInput: userInput): User
    deleteUser(_id: ID!): User
    createPost(postInput: postInput): Post
    deletePost(_id: ID!): Post
    createComment(post: ID!, comment: String!, author: ID!): Comment
    deleteComment(_id: ID!): Comment
    updateSettings(_id: ID!, settings: String!): User
    updateGeolocation(_id: ID!, geolocation: String!): User
    updateBio(_id: ID!, bio: String!): User
    updateProfileImg(_id: ID!, profile_img: String!): User
  }

  schema {
    query: rootQuery
    mutation: rootMutation
  }
`)