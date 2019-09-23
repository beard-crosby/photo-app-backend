import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
    username: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 8 },
    posts: [{ type: Schema.ObjectId, ref: 'Post' }],
    comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
    followers: [{ type: Schema.ObjectId, ref: 'User' }],
    status: {type: String, default: 'Active'},
    logged_in_at: { type: Date, default: null},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})

export default mongoose.model('User', userSchema)
