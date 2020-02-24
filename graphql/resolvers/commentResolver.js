const Post = require('../../models/post')
const Comment = require('../../models/comment')

module.exports = {
  createComment: async ({ post, comment, author }) => {
    try {
      const tempPost = await Post.findOne({ _id: post })
      if (!tempPost) throw new Error("A Post by that ID was not found!")
      console.log(tempPost)

      const tempComment = new Comment(
        {
          comment,
          author
        },
        err => {
          if (err) throw err
        }
      )
      
      await tempPost.comments.push(tempComment)
      await tempPost.save()

      return {
        ...tempComment._doc
      }

    } catch (err) {
      throw err
    }
  }
}