const { verify, sign } = require("jsonwebtoken")

function genarateToken(data) {
    const token = sign(data, process.env.JWT_KEY, {
        expiresIn: "24h"
    })
    return token
}

function authorization(...roles) {
    return function (req, res, next) {
        try {
            let token = req.headers.authorization?.split(" ")[1]
            if (!token) return res.status(500).json({ messsage: "Token is missing" })
            //verify that the token
            const tokenData = verify(token, process.env.JWT_KEY)
            if (!tokenData) return res.status(500).json({ messsage: "Invalid token" })
            res.userId = tokenData.id
            res.role = tokenData.role
            //refresh the authorization
            const newToken = genarateToken({ id: tokenData.id, role: tokenData.role })
            res.token = newToken
            if (!roles.includes(tokenData.role)) {
                return res.status(500).json({ messsage: `${tokenData.role} not allowed` })
            } else {
                next()
            }
        } catch (error) {
            res.status(500).json({ message: `${error.name} ${error.message}` })
        }
    }

}

module.exports = { authorization, genarateToken }