module.exports = authSchema = `
  type User {
    _id: ID!
    token: String!
    token_expiry: Int!
    logged_in_at: String
    geolocation: String
    name: String!
    email: String!
    website: String
    bio: String
    profile_picture: String
    posts: [Post]
    following: [User]
    created_at: String
    updated_at: String
    settings: String
    favourites: [Post]
  }

  input userInput {
    name: String!
    email: String!
    password: String!
    pass_confirm: String!
  }
`