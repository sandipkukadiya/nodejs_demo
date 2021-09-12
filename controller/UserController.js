'use strict';
var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);
const config = require('../config.json');
const db = require('../_helper/db');
const UserLogins = db.UserLogins;

module.exports = {
    profile: async (req, res, next) => {
        const isUser = await UserLogins.findOne({ _id: req.user._id }).lean().exec();
        if (isUser) {
            return res.send({ status: true, message: "Success!", data:isUser });
        }else{
            return res.send({ status: false, message: "Error!" });
        }    
    },
    logout: async (req, res, next) => {
       const status = await jwtr.destroy(req.user.jti, config.jwd_secret);
       if(status){
            return res.send({ status: true, message: "Success!"});
       }else{
            return res.send({ status: false, message: "Error!" });
       }
    }
}