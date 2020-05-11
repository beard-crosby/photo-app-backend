const mongoose = require('mongoose')
const moment = require('moment')

const commentSchema = new mongoose.Schema({
  post: { type: String, required: true },
  author: { type: String, required: true },
  comment: { type: String, required: true },
  created_at: { type: String, default: moment().format() },
	updated_at: { type: String, default: moment().format() },
})

module.exports = mongoose.model('Comment', commentSchema)