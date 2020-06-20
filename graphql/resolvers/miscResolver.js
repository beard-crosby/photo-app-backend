const User = require("../../models/user")
const moment = require("moment")
const aws = require("aws-sdk")

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'eu-west-2',
})

module.exports = {
  updateSettings: async ({ _id, settings }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")
      
      user.settings = JSON.parse(settings)
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        settings: settings,
      }
    } catch (err) {
      throw err
    }
  },
  updateGeolocation: async ({ _id, geolocation }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")

      user.geolocation = JSON.parse(geolocation)
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        geolocation: geolocation
      }
    } catch (err) {
      throw err
    }
  },
  updateStatus: async ({ _id, status }) => {
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")

      user.status = status
      await user.save()

      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  signS3: ({ filename, filetype }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const s3Params = {
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
        Expires: 60,
        ContentType: filetype,
        ACL: 'public-read',
      }

      const signedRequest = s3.getSignedUrl('putObject', s3Params)
      const url = `http://${process.env.AWS_BUCKET}.s3.eu-west-2.amazonaws.com/${filename}`

      return {
        signedRequest,
        url,
      }
    } catch (err) {
      throw err
    }
  },
  deleteS3: async ({ filename }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: filename.substring(filename.indexOf("amazonaws.com/") + 14),
      }, err => {
        if (err) throw err
      }).promise()

      return {
        filename
      }
    } catch (err) {
      throw err
    }
  },
}