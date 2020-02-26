module.exports = authSchema = `
  type User {
    _id: ID!
    token: String!
    tokenExpiry: Int!
    name: String!
    username: String!
    email: String!
    bio: String
    profileImg: String
    posts: [Post]
    following: [User]
  }

  input userInput {
    name: String!
    username: String!
    email: String!
    bio: String
    profileImg: String
    password: String!
    passConfirm: String!
  }
`