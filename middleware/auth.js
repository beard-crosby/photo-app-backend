import jwt from 'jsonwebtoken'

export default function (req, res, next) {
    const authHeader = req.get("Authorization")

    if (!authHeader) {
        req.isAuth = false
        return next()
    }

    const token = authHeader.split(" ")[1]
    if (!token || token === "") {
        req.isAuth = false
        return next()
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch(e) {
        req.isAuth = false
        console.log(e)
        return next()
    }

    if (!decodedToken) {
        req.isAuth = false
        return next()
    }

    req.isAuth = true
    req._id = decodedToken._id
    next()
}
