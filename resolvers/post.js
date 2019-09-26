const User = require('../models/user')
const Post = require('../models/post')

module.exports.createPost = async function (args, req) {
    if (process.env.NODE_ENV !== 'development') {
        if (!req.isAuth) {
            throw new Error("Not Logged In")
        }
    }
    
    try {
        const now = new Date()
        const { title, description, image, author } = args.postInput

        // async process the image

        const post = new Post(
            {
                title,
                description,
                image: "http://placehold.co/500x500",
                author
            },
            err => {
                if (err) throw err
            }
        )

        const user = await User.findById(author)
        if (!user) {
            throw new Error('User not found')
        }

        await post.save()
        await user.posts.push(post)
        await user.save()

        return {
            ...post._doc
        }

        // const populatedPost = await Post.findOne({
        //     _id
        // }).populate("author")
        // return populatedPost



    } catch(err) {
        throw err
    }
}

module.exports.getPosts = async function(args) {
    try {
        console.log(args)
        const posts = await Post.find()
        console.log(posts)
        return posts
            
    } catch(err) {
        throw err
    }
}
