const User = require('../../models/user')
const Post = require('../../models/post')

module.exports = {
  createPost: async args => {
    try {
      const { img, title, description, author } = args.postInput
      const user = await User.findOne({ _id: author })
      if (!user) throw new Error("A User by that ID was not found!")

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
      
      await post.save()
      await user.posts.push(post)
      await user.save()
      
      return {
        ...post._doc
      }

    } catch (err) {
      throw err
    }
  },
  posts: async () => {
    try {
      const posts = await Post.find()
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
        post = await Post.findOne({ _id: _id })
        if (!post) throw new Error("A Post by that ID was not found!")
      } else {
        post = await Post.findOne({ author: author })
        if (!post) throw new Error("A Post by that Author ID was not found!")
      }
      return post
    } catch (err) {
      throw err
    }
  },
}