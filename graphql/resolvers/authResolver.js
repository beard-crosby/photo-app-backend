const bcrypt = require("bcryptjs")
const moment = require("moment")

const User = require("../../models/user")
const Post = require("../../models/post")
const Comment = require("../../models/comment")

const { 
  checkAuthorSettings, 
  checkFollowingAuthorSettings, 
  checkoAuthTokenValidity, 
  userPopulationObj,
  emptyS3Directory,
  signTokens,
 } = require('../../shared/utility')

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
        if (!/^(?=.*\d)(?=.*[a-zA-Z])(?!.*\s).{8,20}$/.test(password)) throw new Error("Your Password must have at least one letter and one number.")
        if (password !== pass_confirm) throw new Error("Passwords do not match.")
        var hashedPass = await bcrypt.hash(password, 12)
      }

      if (!/^[a-zA-Z\s-']{1,30}$/.test(name)) throw new Error("Your Name cannot contain numbers or special characters other than hyphens and apostrophes.")
      if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)) throw new Error("Please enter a valid email address.")

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
            overlay: true,
            own_posts: true,
            random_posts: true,
            collage_style: false,
            post_comments: false,
            post_watermark: false,
            display_email: false,
            display_website: true,
            display_contact_me: false,
            location_services: true,
            online_status: true,
            private_profile: false,
            private_posts: false,
          },
        },
        err => {
          if (err) throw new Error(err)
        }
      )
  
      await user.save()

      return {
        ...user._doc,
        tokens: JSON.stringify(signTokens(user)),
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

      if (oAuthToken) await checkoAuthTokenValidity(oAuthToken)

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

      return {
        ...user._doc,
        tokens: JSON.stringify(signTokens(user)),
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
  user: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id }).populate(userPopulationObj)
      if (!user) throw new Error("A User by that ID was not found!")

      return {
        ...user._doc,
        tokens: req.tokens,
        email: _id === req._id ? user.email : user.settings.display_email ? user.email : "",
        website: _id === req._id ? user.website : user.settings.display_website ? user.website : "",
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
  deleteUser: async ({}, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: req._id }).populate([
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

      await User.deleteOne({ _id: req._id })

      await emptyS3Directory(process.env.AWS_BUCKET, `${req._id}/`)

      return {
        ...user._doc,
      }
    } catch (err) {
      throw err
    }
  },
  updateInfo: async ({ info }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: req._id })
      if (!user) throw new Error("A User by that ID was not found!")

      user.info = JSON.parse(info)
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        tokens: req.tokens,
        info: info,
        email: user.settings.display_email ? user.email : "",
        website: user.settings.display_website ? user.website : "",
      }
    } catch (err) {
      throw err
    }
  },
  updatePP: async ({ profile_picture }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: req._id })
      if (!user) throw new Error("A User by that ID was not found!")

      const newPP = profile_picture.substring(profile_picture.lastIndexOf("/") + 1)
      const oldPP = user.profile_picture.substring(user.profile_picture.lastIndexOf("/") + 1)

      if (oldPP === newPP) throw new Error("Duplicate Profile Picture!")

      user.profile_picture = profile_picture
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        tokens: req.tokens,
        email: user.settings.display_email ? user.email : "",
        website: user.settings.display_website ? user.website : "",
      }
    } catch (err) {
      throw err
    }
  },
  updateFavourites: async ({ post, action }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: req._id })
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
        await user.favourites.unshift(post)
      } else {
        user.favourites = await user.favourites.filter(x => x._id.toString() !== post)
      }

      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        tokens: req.tokens,
        email: user.settings.display_email ? user.email : "",
        website: user.settings.display_website ? user.website : "",
      }
    } catch (err) {
      throw err
    }
  },
  updateBasic: async ({ name, email, website }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({ _id: req._id })
      if (!user) throw new Error("A User by that ID was not found!")

      if (!name && !email && !website) throw new Error("No Name, Email or Website was passed!")
      
      if (name) {
        if (name === "") {
          throw new Error("Your Name must have at least one letter!")
        } else if (!/^[a-zA-Z\s-']{1,30}$/.test(name)) {
          throw new Error("Your Name cannot contain numbers or special characters other than hyphens and apostrophes.")
        } else if (user.name === name) {
          throw new Error("Duplicate Name!")
        } else {
          user.name = name
        }
      } 
      
      if (email) {
        if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email) || email === "") {
          throw new Error("Please enter a valid email address.")
        } else if (user.email === email) {
          throw new Error("Duplicate Email!")
        } else {
          user.email = email
        }
      } 
      
      if (website) {
        if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(website)) {
          throw new Error("Please enter a valid URL")
        } else if (user.website === website) {
          throw new Error("Duplicate Website!")
        } else {
          user.website = website
        }
      }

      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        tokens: req.tokens,
        email: user.settings.display_email ? user.email : "",
        website: user.settings.display_website ? user.website : "",
      }
    } catch (err) {
      throw err
    }
  },
  updatePassword: async ({ oldPass, newPass, newPassConfirm }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const user = await User.findOne({_id: req._id})
      if (!user) throw new Error("A User by that ID was not found!")

      if (!bcrypt.compareSync(oldPass, user.password)) throw new Error("Incorrect Password.")
      if (!newPass || !newPassConfirm) throw new Error("Provide a new password.")
      if (newPass !== newPassConfirm) throw new Error("Passwords do not match.")

      user.refresh_count++ // Invalidate all of the tokens for this user.
      user.password = await bcrypt.hash(newPass, 12)
      user.updated_at = moment().format()
      await user.save()

      return {
        ...user._doc,
        tokens: JSON.stringify(signTokens(user)),
        email: user.settings.display_email ? user.email : "",
        website: user.settings.display_website ? user.website : "",
        password: null,
      }
    } catch (err) {
      throw err
    }
  },
}
