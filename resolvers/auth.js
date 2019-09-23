const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

module.exports.createUser = async function (args) {
    try {
        const { email, username, password, confirm } = args.userInput

        const testEmail = await User.findOne({ email })
        const testUsername = await User.findOne({ username })
        if (testEmail || testUsername) {
            throw new Error("User Already Exists")
        }

        if (password !== confirm) {
            throw new Error("Passwords don't match.")
        }

        const hashedPass = await bcrypt.hash(password, 12)

        const user = new User(
            {
                email,
                username,
                password: hashedPass,
            },
            err => {
                if (err) throw err
            }
        )

        user.save()

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        return {
            token,
            password: null,
            ...user._doc,
        }
    } catch (err) {
        throw err
    }
}

module.exports.login =  async function(args) {
    try {
        const user = await User.findOne({ username: args.username })

        if (!user) throw new Error("Username doesn't exist")

        const passIsValid = await bcrypt.compareSync(
            args.password,
            user.password
        )

        if (!passIsValid) throw new Error("Wrong Password")

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        })

        return {
            token,
            password: null,
            ...user._doc,
        }
    } catch (err) {
        throw err
    }
}

module.exports.verifyToken = async function(args) {
    try {
        const decoded = jwt.verify(args.token, process.env.JWT_SECRET)

        const user = await User.findOne({ _id: decoded.id })
        return { ...user._doc, password: null }
    } catch(err) {
        throw err
    }
}
