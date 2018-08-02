'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: 'Kindly provide a non empty and valid email',
        index: { unique: true },
    },
    passwordHash: {
        type: String,
        required: 'Password is required for register and user and login'
    },
    created_Date: {
        type: Date,
        default: Date.now,
    },
    modified_Date: {
        type: Date,
        default: Date.now,
    },
    token: {
        type: String,
    }
})

module.exports = mongoose.model('User', UserSchema);