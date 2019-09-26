const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')

module.exports.createComment = async function (args, req) {
    if (process.env.NODE_ENV !== 'development') {
        if (!req.isAuth) {
            throw new Error("Not Logged In")
        }
    }

    try {
        const { author, post, body } = args.commentInput

        const comment = new Comment(
            {
                author,
                post,
                body,
            },
            err => {
                if (err) throw err
            }
        )

        const user = await User.findById(author)
        if (!user) {
            throw new Error('User not found')
        }

        const postModel = await Post.findById(post)
        if (!postModel) {
            throw new Error('Post not found')
        }

        await comment.save()
        await user.comments.push(comment)
        await user.save()
        await postModel.comments.push(comment)
        await postModel.save()

        return {
            ...comment._doc
        }

    } catch(err) {
        throw err
    }
}

module.exports.getComments = async function(args, req) {
    try {
        const comments = await Comment.find()
        return comments
    } catch(err) {
        throw err
    }
}
