'use strict';
var authMiddleware = require('../middleware/authMiddleware')
var AuthController = require('../controller/AuthController');
var UserController = require('../controller/UserController');
var NorrisController = require('../controller/NorrisController');

module.exports = function (app) {
    app.route('/api/users/signup').post(AuthController.signup);
    app.route('/api/users/login').post(AuthController.login);

    app.get('/api/users/me', authMiddleware.authJWT, UserController.profile);
    app.get('/api/users/logout', authMiddleware.authJWT, UserController.logout);
    
    app.get('/api/randon-joke', authMiddleware.authJWT, NorrisController.random_joke);
    
};