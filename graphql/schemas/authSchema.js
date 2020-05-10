module.exports = authSchema = `
  type User {
    _id: ID!
    token: String!
    token_expiry: Int!
    logged_in_at: String
    geolocation: String
    name: String!
    username: String!
    email: String!
    bio: String
    profile_img: String
    posts: [Post]
    following: [User]
    dark_mode: Boolean!
  }

  input userInput {
    name: String!
    username: String!
    email: String!
    bio: String
    profile_img: String
    password: String!
    pass_confirm: String!
  }

  type S3Payload {
    signedRequest: String!,
    url: String!,
  }
`