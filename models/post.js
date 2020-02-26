const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  img: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date, default: null },
})

module.exports = mongoose.model('Post', postSchema)