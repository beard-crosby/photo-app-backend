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

exports.checkAuthorSettings = checkAuthorSettings
exports.checkFollowingAuthorSettings = checkFollowingAuthorSettings