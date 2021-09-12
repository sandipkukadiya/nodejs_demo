const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.db_uri);
mongoose.Promise = global.Promise;

module.exports = {
    UserLogins: require('../models/userModel'),
    
};
