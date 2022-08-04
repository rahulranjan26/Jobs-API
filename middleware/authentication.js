const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors')
const auth = (req, res, next) => {
    const headerAuth = req.headers.authorization;
    // console.log(headerAuth)
    if (!headerAuth || !headerAuth.startsWith('Bearer ')) {
        throw new UnauthenticatedError("Authentication Invalid")
    }
    const token = headerAuth.split(' ')[1]
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication Invalid")
    }
}
module.exports = auth