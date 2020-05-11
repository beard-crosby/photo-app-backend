const Post = require('../../models/post')
const Comment = require('../../models/comment')

module.exports = {
  createComment: async ({ post, comment, author }) => {
    try {
      const tempPost = await Post.findOne({ _id: post })
      if (!tempPost) throw new Error(JSON.stringify({ _id: "A Post by that ID was not found!"}))

      const testComment = await Comment.findOne({ post: post, comment: comment, author: author })
      if (testComment) throw new Error(JSON.stringify({ duplicateComment: "Duplicate Comment!"}))

      const newComment = new Comment(
        {
          post,
          comment,
          author,
          created_at: moment().format(),
          updated_at: moment().format(),
        },
        err => {
          if (err) throw err
        }
      )
      
      comment_id = null
      await newComment.save(function(err, comment) {
        comment_id = comment._id
      })
      await tempPost.comments.push(newComment)
      await tempPost.save()

      const findComment = await Comment.findOne({ _id: comment_id }).populate([
        {
          path: 'post',
          model: 'Post',
        },
        {
          path: 'author',
          model: 'User',
        },
      ])

      return {
        ...findComment._doc
      }

    } catch (err) {
      throw err
    }
  },
  allComments: async () => {
    try {
      const comments = await Comment.find().populate([
        {
          path: 'post',
          model: 'Post',
        },
        {
          path: 'author',
          model: 'User',
        },
      ])
      return comments.map(comment => {
        return comment
      })
    } catch (err) {
      throw err
    }
  },
  comment: async ({ _id, post, author }) => {
    try {
      let comment = null
      if (_id) {
        comment = await Comment.findOne({ _id: _id }).populate([
          {
            path: 'post',
            model: 'Post',
          },
          {
            path: 'author',
            model: 'User',
          },
        ])
        if (!comment) throw new Error(JSON.stringify({ _id: "A Comment by that ID was not found!"}))
      } else if (post) {
        comment = await Comment.findOne({ post: post }).populate([
          {
            path: 'post',
            model: 'Post',
          },
          {
            path: 'author',
            model: 'User',
          },
        ])
        if (!comment) throw new Error(JSON.stringify({ post: "A Comment on that Post was not found!"}))
      } else {
        comment = await Comment.findOne({ author: author }).populate([
          {
            path: 'post',
            model: 'Post',
          },
          {
            path: 'author',
            model: 'User',
          },
        ])
        if (!comment) throw new Error(JSON.stringify({ author: "A Comment by that Author was not found!"}))
      }
      return {
        ...comment._doc
      }
    } catch (err) {
      throw err
    }
  },
  deleteComment: async ({ _id }) => {
    try {
      const comment = await Comment.findOne({ _id: _id })
      if (!comment) throw new Error(JSON.stringify({ _id: "A Comment by that ID was not found!"}))

      await Comment.deleteOne({ _id: _id })
      return {
        ...comment._doc
      }
    } catch (err) {
      throw err
    }
  },
}