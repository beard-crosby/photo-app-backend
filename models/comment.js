const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    post: {type: mongoose.Schema.ObjectId, ref: 'Post'},
    body: {type: String, required: false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})

module.exports =  mongoose.model('Comment', commentSchema)
