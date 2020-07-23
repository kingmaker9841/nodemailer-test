const mongoose = require('mongoose');
const users = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true},
    resetPasswordToken: {type: String},
    resetPasswordTokenExpiresIn: {type: Date}
});

const User = mongoose.model('users', users);
module.exports = User;
