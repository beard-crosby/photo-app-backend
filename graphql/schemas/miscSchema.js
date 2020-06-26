module.exports = miscSchema = `
  type S3Payload {
    signedRequest: String!,
    url: String!,
    tokens: String,
  }
`