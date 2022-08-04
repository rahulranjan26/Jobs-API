const User = require('../models/User.js');
const {StatusCodes} = require('http-status-codes');
const {BadRequestError, UnauthenticatedError} = require('../errors/index');

const register = async (req, res) => {
    const user = await User.create({...req.body});
    const token = user.getJWT();
    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name,
        },
        token: token
    });
    /*
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError("Please provide name, email and password")
    }
    */
}

const login = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }
    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError("No user with this email")
    }
    const token = user.getJWT();
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new BadRequestError("Invalid password");
    }
    res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {
    register: register,
    login: login
}

