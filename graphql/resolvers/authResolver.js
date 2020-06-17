const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const moment = require("moment")

const User = require("../../models/user")
const Post = require("../../models/post")
const Comment = require("../../models/comment")

const { checkAuthorSettings, checkFollowingAuthorSettings, checkoAuthTokenValidity, userPopulationObj } = require('../../shared/utility')

module.exports = {
  createUser: async args => {
    try {
      const { name, email, password, pass_confirm, profile_picture, oAuthToken } = args.userInput
      const testUser = await User.findOne({ email })

      if (oAuthToken) {
        await checkoAuthTokenValidity(oAuthToken)
      }

      if (testUser) {
        if (testUser.password) {
          throw new Error("An account by that email already exists! Please try and login.")
        } else if (!testUser.password && oAuthToken) {
          throw new Error("oAuth Login")
        } else {
          throw new Error("A Google account by that email already exists! Please try and login.")
        }
      }

      if (password) {
        if (password !== pass_confirm) throw new Error("Passwords do not match.")
        var hashedPass = await bcrypt.hash(password, 12)
      }

      const user = new User(
        {
          status: "online",
          name,
          email,
          website: "",
          info: {
            about: "",
          },
          profile_picture: profile_picture ? profile_picture : "",
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
        ...user._doc,
        token,
        token_expiry: 1,
        email: "",
        website: "",
        password: null,
        info: JSON.stringify(user._doc.info),
        settings: JSON.stringify(user._doc.settings),
      }
    } catch (err) {
      throw err
    }
  },
  login: async ({ email, password, oAuthToken }) => {
    try {
      const user = await User.findOne({ email }).populate(userPopulationObj)

      if (!user) throw new Error("An Account by that Email was not found!")

      if (oAuthToken) {
        await checkoAuthTokenValidity(oAuthToken)
      }

      if (user.password) {
        if (oAuthToken) throw new Error("The account for this email wasn't created with Google.")
        if (!password) throw new Error("Please enter your password.")
        if (!bcrypt.compareSync(password, user.password)) throw new Error("Incorrect Password.")
      } else {
        if (!oAuthToken) throw new Error("The account for this email is a Google account.")
      }

      user.status = "online"
      user.logged_in_at = moment().format()
      await user.save()

      const token = jwt.sign(
        { 
          _id: user._id, 
          email: user.email,
        }, 
        `${process.env.JWT_SECRET}`, 
        { expiresIn: "1h" }
      )

      return {
        ...user._doc,
        token,
        token_expiry: 1,
        email: user.settings.display_email ? user.email : "",
        website: user.settings.display_website ? user.website : "",
        posts: await checkAuthorSettings(user.posts),
        following: await checkFollowingAuthorSettings(user.following),
        favourites: await checkAuthorSettings(user.favourites),
        info: JSON.stringify(user._doc.info),
        geolocation: JSON.stringify(user._doc.geolocation),
        settings: JSON.stringify(user._doc.settings),
        password: null,
      }
    } catch (err) {
      throw err
    }
  },
  user: async ({ _id }) => {
    try {
      const user = await User.findOne({ _id }).populate(userPopulationObj)
      if (!user) throw new Error("A User by that ID was not found!")

      return {
        ...user._doc,
        info: JSON.stringify(user._doc.info),
        posts: await checkAuthorSettings(user.posts),
        following: await checkFollowingAuthorSettings(user.following),
        favourites: await checkAuthorSettings(user.favourites),
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
      const user = await User.findOne({ _id: _id }).populate([
        {
          path: 'posts',
          model: 'Post',
          populate: {
            path: 'comments',
            model: 'Comment',
          },
        },
      ])
      if (!user) throw new Error("A User by that ID was not found!")

      await user.posts.forEach(async post => {
        await post.comments.forEach(async comment => {
          await Comment.deleteOne({ _id: comment._id })
        })
        await Post.deleteOne({ _id: post._id })
      })

      await User.deleteOne({ _id: _id })

      return {
        ...user._doc
      }
    } catch (err) {
      throw err
    }
  },
  updateInfo: async ({ _id, info }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")

      user.info = JSON.parse(info)
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        info: info
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
  updateFavourites: async ({ _id, post, action }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: _id })
      if (!user) throw new Error("A User by that ID was not found!")
      
      const postTest = await Post.findOne({ _id: post })
      if (!postTest) throw new Error("A Post by that ID was not found!")

      if (user._id.toString() === postTest.author) throw new Error("You can't favourite your own post!")

      if (action === "add") {
        await user.favourites.forEach(fav => {
          if (post.toString() === fav._id.toString()) {
            throw new Error("Duplicate Favourite!")
          }
        })
        await user.favourites.push(post)
      } else {
        await user.favourites.pull(post)
      }

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
