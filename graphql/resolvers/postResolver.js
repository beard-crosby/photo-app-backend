const User = require('../../models/user')
const Post = require('../../models/post')

module.exports = {
  createPost: async args => {
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
        },
        err => {
          if (err) throw err
        }
      )
      
      let post_id = null
      await post.save(function(err, post) {
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
      return posts.map(post => {
        return post
      })
    } catch (err) {
      throw err
    }
  },
  post: async ({ _id, author }) => {
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
}