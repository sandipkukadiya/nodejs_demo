'use strict';
let bcrypt = require('bcrypt');
var redis = require('redis');
var JWTR =  require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);

const config = require('../config.json');
const db = require('../_helper/db');
const UserLogins = db.UserLogins;
let saltRounds = 10;

module.exports = {
    signup: async (req, res, next) => {
        const {
            username,
            email,
            mobile,
            password,
            address
        } = req.body;

        if (!username)
        return res.send({ status: false, message: "Username is required" });

        if (!email)
            return res.send({ status: false, message: "Email is required" });

        if (!password)
            return res.send({ status: false, message: "Password is required" });

        if (!mobile)
            return res.send({ status: false, message: "Mobile No. is required" });

        const isUser = await UserLogins
            .findOne({ $or: [{ email: email }, { username: username }, { mobile: mobile }] })
            .lean().exec();

        if (isUser) {
            let msg = 'This';
            if (isUser.email === email) {
                msg += ' Email';
            } else if (isUser.username === username) {
                msg += ' Username';
            } else if (isUser.mobile === mobile) {
                msg += ' Mobile No';
            }
            msg += ' is already registered';

            return res.send({ status: false, message: msg });
        }    

        const hash = bcrypt.hashSync(password, saltRounds);
        const data = {
            username: username,
            email: email,
            mobile: mobile,
            password: hash,
            address: address
        };
        await (new UserLogins(data)).save();
        return res.send({ status: true, message: "Success!" });
    },
    login: async (req, res, next) => {
        const { username, password } = req.body;
        UserLogins.findOne({ $or: [{ email: username }, { username: username }] }).then( async (data) => {
            if(data){
                let compare = await bcrypt.compareSync(password, data.password);
                if(compare){
                    let user = { username: data.email, _id: data._id, time: new Date().getTime() };
                    const accessToken = await jwtr.sign(user, config.jwd_secret);
                    res.json({ status: true, message: "Success!", token: accessToken });
                }else{
                    res.json({ status: true, message: "Invalid Password!" });
                }
            }else{
                return res.send({ status: false, message: "User not Found!" })
            }
        })

    }
}