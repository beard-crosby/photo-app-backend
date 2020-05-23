const mongoose = require('mongoose')
const moment = require('moment')

const userSchema = new mongoose.Schema({
	status: { type: String, default: "offline" },
	name: { type: String, required: true },
	email: { type: String, required: true },
	website: { type: String, required: false },
	bio: { type: String, required: false },
	profile_picture: { type: String, required: false },
	password: { type: String, required: true, min: 8 },
	posts: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
	following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
	logged_in_at: { type: String, default: null },
	geolocation: { type: Object, default: null },
	created_at: { type: String, default: moment().format() },
	updated_at: { type: String, default: moment().format() },
	settings: { type: Object, required: true },
	favourites: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
})

module.exports = mongoose.model('User', userSchema)
