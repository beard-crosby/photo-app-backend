const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 8 },
    posts: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
    comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    status: { type: String, default: 'active' },
    logged_in_at: { type: Date, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})

module.exports = mongoose.model('User', userSchema)
