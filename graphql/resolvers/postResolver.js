const User = require('../../models/user')
const Post = require('../../models/post')
const Comment = require('../../models/comment')
const moment = require("moment")
const aws = require("aws-sdk")

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'eu-west-2',
})

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

      if (title.length === 0) throw new Error("Title cannot be empty!")
      if (title.length > 60) throw new Error("Title must be a maximum of 60 characters.")
      if (description.length > 300) throw new Error("Description must be a maximum of 300 characters.")
      
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
        ...findPost._doc,
        tokens: req.tokens,
        author: {
          ...findPost._doc.author._doc,
          email: findPost.author.settings.display_email ? findPost.author.email : "",
          website: findPost.author.settings.display_website ? findPost.author.website : "",
        }
      }

    } catch (err) {
      throw err
    }
  },
  allPosts: async () => {
    try {
      const posts = await Post.find()

      if (posts.length === 0) {
        console.log("There aren't any Posts! Houston, we have a problem...")
        throw new Error("There aren't any Posts! Houston, we have a problem...")
      }

      return posts.map(post => {
        return post
      })
    } catch (err) {
      throw err
    }
  },
  deletePost: async ({ _id }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const post = await Post.findOne({ _id: _id }).populate([
        {
          path: 'comments',
          model: 'Comment',
        },
      ])

      if (!post) throw new Error("A Post by that ID was not found!")

      await post.comments.forEach(async comment => {
        await Comment.deleteOne({ _id: comment._id })
      })
      
      await Post.deleteOne({ _id: _id })

      await s3.deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: post.img.substring(post.img.indexOf("amazonaws.com/") + 14),
      }, err => {
        if (err) throw err  // error
      }).promise()

      return {
        ...post._doc,
        tokens: req.tokens,
      }
    } catch (err) {
      throw err
    }
  },
  updateTitle: async ({ _id, title }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const post = await Post.findOne({ _id: _id })
      if (!post) throw new Error("A Post by that ID was not found!")

      if (title.length === 0) throw new Error("Title cannot be empty!")
      if (title.length > 60) throw new Error("Title must be a maximum of 60 characters.")

      post.title = title
      post.updated_at = moment().format()
      await post.save()

      return {
        ...post._doc,
        tokens: req.tokens,
      }
    } catch (err) {
      throw err
    }
  },
  updateDescription: async ({ _id, description }, req) => {
    if (!req.isAuth) {
      throw new Error("Not Authenticated!")
    }
    try {
      const post = await Post.findOne({ _id: _id })
      if (!post) throw new Error("A Post by that ID was not found!")

      if (description.length > 300) throw new Error("Description must be a maximum of 300 characters.")

      post.description = description
      post.updated_at = moment().format()
      await post.save()

      return {
        ...post._doc,
        tokens: req.tokens,
      }
    } catch (err) {
      throw err
    }
  },
}