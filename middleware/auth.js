const jwt = require('jsonwebtoken')
const User = require("../models/user")

const { signTokens } = require("../shared/utility")

module.exports = async (req, res, next) => {
	const accessTokenHeader = req.get("accessToken")
	const refreshTokenHeader = req.get("refreshToken")
	req.isAuth = false

	if (!accessTokenHeader && !refreshTokenHeader) {
		return next()
	} 

	const accessToken = accessTokenHeader.split(" ")[1]
	if (!accessToken || accessToken === "") {
		return next()
	}

	try {
		const verifiedToken = jwt.verify(accessToken, `${process.env.ACCESS_TOKEN_SECRET}`)
		req.isAuth = true
		req._id = verifiedToken._id
		return next()
	} catch {}

	if (!refreshTokenHeader) {
		return next()
	}

	const refreshToken = refreshTokenHeader.split(" ")[1]
	if (!refreshToken || refreshToken === "") {
		return next()
	}

	let verifiedRefreshToken
	try {
		verifiedRefreshToken = jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN_SECRET}`)
	} catch {
		return next()
	}

	const user = await User.findOne({ _id: verifiedRefreshToken._id })
	if (!user || user.refresh_count !== verifiedRefreshToken.refresh_count) {
		return next()
	}

	req.tokens = JSON.stringify(signTokens(user))
	req.isAuth = true
	req._id = verifiedRefreshToken._id
	next()
}