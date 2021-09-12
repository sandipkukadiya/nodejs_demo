'user strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    mobile: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    address: { type: String }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('users', schema);