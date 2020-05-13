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
    profile_img: String
    posts: [Post]
    following: [User]
    dark_mode: Boolean!
    created_at: String
    updated_at: String
  }

  input userInput {
    name: String!
    email: String!
    password: String!
    pass_confirm: String!
  }
`