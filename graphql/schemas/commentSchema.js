module.exports = commentSchema = `
  type Comment {
    _id: ID!
    tokens: String
    post: Post!
    comment: String!
    author: User!
    created_at: String
    updated_at: String
  }
`