'use strict';

const axios = require('axios');

module.exports = {
    random_joke: async (req, res, next) => {
        let headers= {};
        axios.get('https://api.chucknorris.io/jokes/random', { headers: headers }).then((response) => {
            return res.send({ status: true, message: "Success!", data:response.data });
        }).catch((error) => {
            return res.send({ status: false, message: "Error1!" });
        })  
    }
}