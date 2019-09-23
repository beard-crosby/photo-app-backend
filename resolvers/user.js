const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

module.exports.getUser =  async function(args, req) {
    // Check Auth
    // if (process.env.APP_ENV !== "dev") {
    //     if (!req.isAuth) {
    //         throw new Error("Not Logged In")
    //     }
    // }

    try {
        const { _id, token } = args

        const user = await User.findOne({ _id })

        const tokenIsValid = (token) => {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            if (_id === user._id && user._id === decoded.id) {
                return true
            } else {
                return false
            }
        }

        console.log(tokenIsValid(token))

        return { 
            ...user._doc,
        }
    } catch (e) {
        throw e
    }
}