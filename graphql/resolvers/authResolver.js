const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const moment = require("moment")

const User = require("../../models/user")

module.exports = {
  createUser: async args => {
    try {
      const { name, email, password, pass_confirm } = args.userInput
  
      const testEmail = await User.findOne({ email })

      if (testEmail) throw new Error("An Account by that Email already exists!")
      if (password !== pass_confirm) throw new Error("Passwords do not match.")
  
      const hashedPass = await bcrypt.hash(password, 12)

      const user = new User(
        {
          name,
          email,
          website: "",
          bio: "",
          profile_picture: "",
          logged_in_at: moment().format(),
          password: hashedPass,
          created_at: moment().format(),
          updated_at: moment().format(),
          settings: { 
            dark_mode: false,
            own_posts: true,
            display_email: false,
            display_website: true,
          },
        },
        err => {
          if (err) throw new Error(err)
        }
      )
  
      await user.save()
  
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "1h" }
      )
  
      return {
        token,
        token_expiry: 1,
        password: null,
        ...user._doc,
        settings: JSON.stringify(user._doc.settings)
      }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email }).populate([
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
        {
          path: 'favourites',
          model: 'Post',
          populate: {
            path: 'author',
            model: 'User',
          }
        },
      ])

      if (!user) throw new Error("An Account by that Email was not found!")
      if (!password) throw new Error("Please enter your password")
      
      const passIsValid = bcrypt.compareSync( password, user.password )
      if (!passIsValid) throw new Error("Incorrect Password")
  
      const token = jwt.sign(
        { 
          _id: user._id, 
          email: user.email,
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
        settings: JSON.stringify(user._doc.settings)
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
      if (!users) throw new Error("There aren't any Users! Houston, we have a problem...")
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
      if (!user) throw new Error("A User by that ID was not found!")
      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  deleteUser: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")

      await User.deleteOne({ _id: _id })
      return {
        ...user._doc
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
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")

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
  updatePP: async ({ _id, profile_picture }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")

      user.profile_picture = profile_picture
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
}
