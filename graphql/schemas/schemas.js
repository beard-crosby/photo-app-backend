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
    allUsers: [User!]!
    post(_id: ID, author: ID): Post!
    allPosts: [Post!]!
    comment(_id: ID, post: ID, author: ID): Comment!
    allComments: [Comment!]!
    login(email: String, username: String, password: String!): User!
  }

  type rootMutation {
    createUser(userInput: userInput): User
    deleteUser(_id: ID!): User
    createPost(postInput: postInput): Post
    deletePost(_id: ID!): Post
    createComment(post: ID!, comment: String!, author: ID!): Comment
    deleteComment(_id: ID!): Comment
  }

  schema {
    query: rootQuery
    mutation: rootMutation
  }
`)