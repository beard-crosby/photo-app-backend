module.exports = postSchema = `
  type Post {
    _id: ID!
    img: String!
    title: String!
    description: String
    author: ID!
    comments: [Comment!]!
  }

  input postInput {
    img: String!
    title: String!
    description: String
    author: ID!
  }
`