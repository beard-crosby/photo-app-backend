const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../../models/user")

module.exports = {
  createUser: async args => {
    try {
      const { name, username, email, bio, profileImg, password, passConfirm } = args.userInput
  
      const testUsername = await User.findOne({ username })
      const testEmail = await User.findOne({ email })
  
      if (testUsername) throw new Error("A User by that Username already exists!")
      if (testEmail) throw new Error("A User by that Email already exists!")
      if (password !== passConfirm) throw new Error("Passwords don't match.")
  
      const hashedPass = await bcrypt.hash(password, 12)
  
      const user = new User(
        {
          name,
          username,
          email,
          bio,
          profileImg,
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
        tokenExpiry: 1,
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
        if (!user) throw new Error("A User by that Email was not found!")
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
        if (!user) throw new Error("A User by that Username was not found!")
      }
  
      const passIsValid = await bcrypt.compareSync(
        password,
        user.password
      )
  
      if (!passIsValid) throw new Error("Wrong Password")
  
      const token = jwt.sign(
        { 
          _id: user._id, 
          email: user.email, 
          username: user.username 
        }, 
        `${process.env.JWT_SECRET}`, 
        { expiresIn: "1h" }
      )
  
      return {
        token,
        tokenExpiry: 1,
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
      if (!users) throw new Error("There aren't any Users! WHAA?!")
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
  deleteUser: async ({ _id }) => {
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
  }
}
