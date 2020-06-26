const mongoose = require('mongoose')
const moment = require('moment')

const userSchema = new mongoose.Schema({
	status: { type: String, default: "offline" },
	posts: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
	following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
	logged_in_at: { type: String, default: null },
	geolocation: { type: Object, default: null },
	created_at: { type: String, default: moment().format() },
	updated_at: { type: String, default: moment().format() },
	favourites: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
	refresh_count: { type: Number, default: 0 },
	name: { type: String, required: true },
	email: { type: String, required: true },
	website: { type: String, required: false },
	info: { type: Object, required: true },
	profile_picture: { type: String, required: false },
	password: { type: String, required: false, min: 8 },
	settings: { type: Object, required: true },
})

module.exports = mongoose.model('User', userSchema)