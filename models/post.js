const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    author: {type: mongoose.Schema.ObjectId, ref: 'User'},
    title: {type: String, required: false},
    description: {type: String, required: false},
    image: {type: String, required: true},
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    status: {type: String, default: null},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})

module.exports = mongoose.model('Post', postSchema)
