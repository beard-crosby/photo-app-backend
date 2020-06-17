const Post = require('../../models/post')
const Comment = require('../../models/comment')
const moment = require("moment")

module.exports = {
  createComment: async ({ post, comment, author }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const tempPost = await Post.findOne({ _id: post })
      if (!tempPost) throw new Error("A Post by that ID was not found!")

      if (tempPost.author === author) throw new Error("You can't comment on your own post!")

      const testComment = await Comment.findOne({ post: post, comment: comment, author: author })
      if (testComment) throw new Error("Duplicate Comment!")

      const newComment = new Comment(
        {
          post,
          comment,
          author,
          created_at: moment().format(),
          updated_at: moment().format(),
        },
        err => {
          if (err) throw new Error(err)
        }
      )
      
      await newComment.save()
      await tempPost.comments.unshift(newComment)
      await tempPost.save()

      return {
        ...newComment._doc
      }

    } catch (err) {
      throw err
    }
  },
  allComments: async req => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
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
  comment: async ({ _id, post, author }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
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
        if (!comment) throw new Error("A Comment by that ID was not found!")
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
        if (!comment) throw new Error("A Comment on that Post was not found!")
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
        if (!comment) throw new Error("A Comment by that Author was not found!")
      }
      return {
        ...comment._doc
      }
    } catch (err) {
      throw err
    }
  },
  deleteComment: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const comment = await Comment.findOne({ _id: _id })
      if (!comment) throw new Error("A Comment by that ID was not found!")

      await Comment.deleteOne({ _id: _id })
      return {
        ...comment._doc
      }
    } catch (err) {
      throw err
    }
  },
}