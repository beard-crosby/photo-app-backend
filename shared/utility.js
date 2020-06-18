const { OAuth2Client } = require('google-auth-library')
const aws = require("aws-sdk")

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'eu-west-2',
})

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

const userPopulationObj = [
  {
    path: 'posts',
    model: 'Post',
    populate: [
      {
        path: 'author',
        model: 'User',
      },
      {
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'User',
        },
      },
    ],
  },
  {
    path: 'following',
    model: 'User',
    populate: {
      path: 'posts',
      model: 'Post',
      populate: [
        {
          path: 'author',
          model: 'User',
        },
        {
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'author',
            model: 'User',
          },
        },
      ],
    },
  },
  {
    path: 'favourites',
    model: 'Post',
    populate: [
      {
        path: 'author',
        model: 'User',
      },
      {
        path: 'comments',
        model: 'Comment',
        populate: {
          path: 'author',
          model: 'User',
        },
      },
    ],
  },
]

const emptyS3Directory = async (bucket, dir) => {
  const listParams = {
    Bucket: bucket,
    Prefix: dir
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise()

  if (listedObjects.Contents.length === 0) return

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] }
  }

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key })
  })

  await s3.deleteObjects(deleteParams).promise()

  if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir)
}

exports.checkAuthorSettings = checkAuthorSettings
exports.checkFollowingAuthorSettings = checkFollowingAuthorSettings
exports.checkoAuthTokenValidity = checkoAuthTokenValidity
exports.userPopulationObj = userPopulationObj
exports.emptyS3Directory = emptyS3Directory