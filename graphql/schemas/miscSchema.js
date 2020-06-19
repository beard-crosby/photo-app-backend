module.exports = miscSchema = `
  type S3Payload {
    signedRequest: String!,
    url: String!,
  }

  type S3Deleted {
    filename: String!
  }
`