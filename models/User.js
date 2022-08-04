const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const json = require("jsonwebtoken");
// User Schema

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
        minLength: [3, 'Please enter longer name'],
        maxLength: [25, 'Please enter a shorter name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter a name'],
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'PLease enter valid Email address'],
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: 6,
        maxLength: 12,
    }
})


UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.getJWT = function () {
    return json.sign({
        userId: this._id,
        name: this.name
    }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRESIN})
}
UserSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch
}
module.exports = mongoose.model('User', UserSchema);

