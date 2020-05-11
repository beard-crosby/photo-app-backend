module.exports = postSchema = `
  type Post {
    _id: ID!
    img: String!
    title: String!
    description: String
    author: User!
    created_at: String
    updated_at: String
    comments: [Comment!]!
  }

  input postInput {
    img: String!
    title: String!
    description: String
    author: ID!
  }
`