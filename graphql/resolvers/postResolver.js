const User = require('../../models/user')
const Post = require('../../models/post')
const moment = require("moment")

module.exports = {
  createPost: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const { img, title, description, author } = args.postInput

      const user = await User.findOne({ _id: author })
      if (!user) throw new Error("A User by that ID was not found!")

      const testPost = await Post.findOne({ 'author': author, 'title': title, 'description': description })
      if (testPost) throw new Error("Duplicate Post!")
      
      const post = new Post(
        {
          img,
          title,
          description,
          author,
          created_at: moment().format(),
          updated_at: moment().format(),
        },
        err => {
          if (err) throw new Error(err)
        }
      )
      
      let post_id = null
      await post.save((err, post) => {
        if (err) throw new Error(err)
        post_id = post._id
      })

      await user.posts.push(post)
      await user.save()

      const findPost = await Post.findOne({ _id: post_id }).populate([
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
          }
        },
      ])

      return {
        ...findPost._doc
      }

    } catch (err) {
      throw err
    }
  },
  allPosts: async () => {
    try {
      const posts = await Post.find().populate([
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
          }
        },
      ])
      if (!posts) throw new Error("There aren't any Posts! Houston, we have a problem...")
      return posts.map(post => {
        return post
      })
    } catch (err) {
      throw err
    }
  },
  post: async ({ _id, author }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      let post = null
      if (_id) {
        post = await Post.findOne({ _id: _id }).populate([
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
            }
          },
        ])
        if (!post) throw new Error("A Post by that ID was not found!")
      } else {
        post = await Post.findOne({ author: author }).populate([
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
            }
          },
        ])
        if (!post) throw new Error("A Post by that Author ID was not found!")
      }
      return {
        ...post._doc
      }
    } catch (err) {
      throw err
    }
  },
  deletePost: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const post = await Post.findOne({ _id: _id })
      if (!post) throw new Error("A Post by that ID was not found!")

      await Post.deleteOne({ _id: _id })
      return {
        ...post._doc
      }
    } catch (err) {
      throw err
    }
  }
}