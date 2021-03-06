const Post = require('../../models/post')
const Comment = require('../../models/comment')
const moment = require("moment")

module.exports = {
  createComment: async ({ post, comment }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const tempPost = await Post.findOne({ _id: post })
      if (!tempPost) throw new Error("A Post by that ID was not found!")

      if (tempPost.author === req._id) throw new Error("You can't comment on your own post!")

      const testComment = await Comment.findOne({ post: post, comment: comment, author: req._id })
      if (testComment) throw new Error("Duplicate Comment!")

      const newComment = new Comment(
        {
          post,
          comment,
          author: req._id,
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
        ...newComment._doc,
        tokens: req.tokens,
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

      return {
        comments,
        tokens: req.tokens,
      }
    } catch (err) {
      throw err
    }
  },
  comment: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const gotComment = await Comment.findOne({ _id: _id }).populate([
        {
          path: 'post',
          model: 'Post',
        },
        {
          path: 'author',
          model: 'User',
        },
      ])
      
      if (!gotComment) throw new Error("A Comment by that ID was not found!")
      
      return {
        ...gotComment._doc,
        tokens: req.tokens,
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
        ...comment._doc,
        tokens: req.tokens,
      }
    } catch (err) {
      throw err
    }
  },
}