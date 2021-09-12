'use strict';
var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);

const config = require('../config.json');

module.exports = {
    authJWT: async (req, res, next) => {
        try{
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                if (token) {
                    let user = await jwtr.verify(token, config.jwd_secret);
                    if(user){
                        req.user = user;
                        next();
                    }else{
                        return res.sendStatus(403);
                    }
                } else {
                    return res.send({ status: false, message: 'Not Authorized' });
                }
            } else {
                res.sendStatus(401);
            }
        } catch (e) {
            return res.sendStatus(401);
            // next(e);
        }
    }
}