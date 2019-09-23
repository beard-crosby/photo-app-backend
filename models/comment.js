import mongoose, { Schema } from 'mongoose'

const commentSchema = new Schema({
    author: {type: Schema.ObjectId, ref: 'User'},
    post: {type: Schema.ObjectId, ref: 'Post'},
    body: {type: String, required: false},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})

export default mongoose.model('Comment', commentSchema)
