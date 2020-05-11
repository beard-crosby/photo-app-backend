const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const aws = require("aws-sdk")
const moment = require("moment")

const User = require("../../models/user")

module.exports = {
  createUser: async args => {
    try {
      const { name, username, email, bio, profile_img, password, pass_confirm } = args.userInput
  
      const testUsername = await User.findOne({ username })
      const testEmail = await User.findOne({ email })
  
      if (testUsername) throw new Error(JSON.stringify({ username: "An Account by that Username already exists!" }))
      if (testEmail) throw new Error(JSON.stringify({ email: "An Account by that Email already exists!" }))
      if (password !== pass_confirm) throw new Error(JSON.stringify({ password: "Passwords do not match." }))
  
      const hashedPass = await bcrypt.hash(password, 12)

      const user = new User(
        {
          name,
          username,
          email,
          bio,
          profile_img,
          logged_in_at: moment().format(),
          dark_mode: false,
          password: hashedPass,
        },
        err => {
          if (err) throw err
        }
      )
  
      await user.save()
  
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email, 
          username: user.username 
        },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "1h" }
      )
  
      return {
        token,
        token_expiry: 1,
        password: null,
        ...user._doc,
      }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, username, password }) => {
    try {
      let user = null
      if (email) {
        user = await User.findOne({ email }).populate([
          {
            path: 'posts',
            model: 'Post',
            populate: {
              path: 'comments',
              model: 'Comment',
              populate: {
                path: 'author',
                model: 'User',
              }
            }
          },
          {
            path: 'following',
            model: 'User',
            populate: {
              path: 'posts',
              model: 'Post',
              populate: {
                path: 'comments',
                model: 'Comment',
                populate: {
                  path: 'author',
                  model: 'User',
                }
              }
            }
          },
        ])
        if (!user) throw new Error(JSON.stringify({ email: "An Account by that Email was not found!" }))
      } else {
        user = await User.findOne({ username }).populate([
          {
            path: 'posts',
            model: 'Post',
            populate: {
              path: 'comments',
              model: 'Comment',
              populate: {
                path: 'author',
                model: 'User',
              }
            }
          },
          {
            path: 'following',
            model: 'User',
            populate: {
              path: 'posts',
              model: 'Post',
              populate: {
                path: 'comments',
                model: 'Comment',
                populate: {
                  path: 'author',
                  model: 'User',
                }
              }
            }
          },
        ])
        if (!user) throw new Error(JSON.stringify({ username: "An Account by that Username was not found!" }))
      }
      
      if (!password) throw new Error(JSON.stringify({ password: "Please enter your password" }))
      const passIsValid = bcrypt.compareSync( password, user.password )
      if (!passIsValid) throw new Error(JSON.stringify({ password: "Incorrect Password" }))
  
      const token = jwt.sign(
        { 
          _id: user._id, 
          email: user.email, 
          username: user.username 
        }, 
        `${process.env.JWT_SECRET}`, 
        { expiresIn: "1h" }
      )

      user.logged_in_at = moment().format()
      await user.save()
  
      return {
        token,
        token_expiry: 1,
        password: null,
        ...user._doc,
      }
    } catch (err) {
      throw err
    }
  },
  allUsers: async () => {
    try {
      const users = await User.find().populate([
        {
          path: 'posts',
          model: 'Post',
          populate: {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'author',
              model: 'User',
            }
          }
        },
        {
          path: 'following',
          model: 'User',
          populate: {
            path: 'posts',
            model: 'Post',
            populate: {
              path: 'comments',
              model: 'Comment',
              populate: {
                path: 'author',
                model: 'User',
              }
            }
          }
        },
      ])
      if (!users) throw new Error(JSON.stringify({ general: "There aren't any Users! WHAA?!" }))
      return users.map(user => {
        return {
          ...user._doc
        }
      })
    } catch (err) {
      throw err
    }
  },
  user: async ({ _id }) => {
    try {
      const user = await User.findOne({ _id }).populate([
        {
          path: 'posts',
          model: 'Post',
          populate: {
            path: 'comments',
            model: 'Comment',
            populate: {
              path: 'author',
              model: 'User',
            }
          }
        },
        {
          path: 'following',
          model: 'User',
          populate: {
            path: 'posts',
            model: 'Post',
            populate: {
              path: 'comments',
              model: 'Comment',
              populate: {
                path: 'author',
                model: 'User',
              }
            }
          }
        },
      ])
      if (!user) throw new Error(JSON.stringify({ _id: "A User by that ID was not found!" }))
      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  deleteUser: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error(JSON.stringify({ auth: 'Not Authenticated!'}))
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error(JSON.stringify({ _id: "A User by that ID was not found!" }))

      await User.deleteOne({ _id: _id })
      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  setDarkMode: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error(JSON.stringify({ auth: 'Not Authenticated!'}))
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error(JSON.stringify({ _id: "A User by that ID was not found!" }))

      user.dark_mode = !user.dark_mode
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  updateGeolocation: async ({ _id, geolocation }, req) => {
    if (!req.isAuth) {
      throw new Error(JSON.stringify({ auth: 'Not Authenticated!'}))
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error(JSON.stringify({ _id: "A User by that ID was not found!" }))

      user.geolocation = geolocation
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  updateBio: async ({ _id, bio }, req) => {
    if (!req.isAuth) {
      throw new Error(JSON.stringify({ auth: 'Not Authenticated!'}))
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error(JSON.stringify({ _id: "A User by that ID was not found!" }))

      user.bio = bio
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  updateProfileImg: async ({ _id, profile_img }, req) => {
    if (!req.isAuth) {
      throw new Error(JSON.stringify({ auth: 'Not Authenticated!'}))
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error(JSON.stringify({ _id: "A User by that ID was not found!" }))

      user.profile_img = profile_img
      user.updated_at = moment().format()
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
      throw new Error(JSON.stringify({ auth: 'Not Authenticated!'}))
    }
    try {
      const s3 = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        signatureVersion: 'v4',
        region: 'eu-west-2',
      })

      const s3Params = {
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
        Expires: 60,
        ContentType: filetype,
        ACL: 'public-read',
      }

      const signedRequest = s3.getSignedUrl('putObject', s3Params)
      const url = `http://${process.env.AWS_BUCKET}.s3-website.eu-west-2.amazonaws.com/${filename}`

      return {
        signedRequest,
        url,
      }
    } catch (err) {
      throw err
    }
  },
}
