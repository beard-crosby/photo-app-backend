const { OAuth2Client } = require('google-auth-library')

const checkAuthorSettings = array => {
  return array.map(post => {
    return {
      ...post._doc,
      author: {
        ...post._doc.author._doc,
        email: post._doc.author._doc.settings.display_email ? post._doc.author._doc.email : "",
        website: post._doc.author._doc.settings.display_website ? post._doc.author._doc.website : "",
      }
    }
  })
}

const checkFollowingAuthorSettings = array => {
  return array.map(followed => {
    return {
      ...followed._doc,
      posts: checkAuthorSettings(followed.posts)
    }
  })
}

const checkoAuthTokenValidity = async oAuthToken => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken: oAuthToken,
    audience: process.env.GOOGLE_CLIENT_ID
  })
  return ticket.getPayload()
}

exports.checkAuthorSettings = checkAuthorSettings
exports.checkFollowingAuthorSettings = checkFollowingAuthorSettings
exports.checkoAuthTokenValidity = checkoAuthTokenValidity