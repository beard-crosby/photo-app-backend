import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema({
    author: {type: Schema.ObjectId, ref: 'User'},
    title: {type: String, required: true},
    description: {type: String, required: false},
    image: {type: String, required: true},
    comments: [{ type: Schema.ObjectId, ref: 'Comment' }],
    status: {type: String, default: null},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    deleted_at: { type: Date, default: null },
})

export default mongoose.model('Post', postSchema)
