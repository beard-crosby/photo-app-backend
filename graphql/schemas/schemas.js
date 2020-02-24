const { buildSchema } = require("graphql")
const authSchema = require("./authSchema")
const postSchema = require("./postSchema")
const commentSchema = require("./commentSchema")

module.exports = buildSchema(`
  ${authSchema}
  ${postSchema}
  ${commentSchema}

  type rootQuery {
    user(_id: ID!): User!
    users: [User!]!
    post(_id: ID, author: ID): Post!
    posts: [Post!]!
    comments: [Comment!]!
    login(email: String, username: String, password: String!): User!
  }

  type rootMutation {
    createUser(userInput: userInput): User
    createPost(postInput: postInput): Post
    createComment(post: ID!, comment: String!, author: ID!): Post
  }

  schema {
    query: rootQuery
    mutation: rootMutation
  }
`)