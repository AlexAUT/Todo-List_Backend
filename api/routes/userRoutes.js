'use strict'
module.exports = function (app) {
  var userController = require("../controllers/userController");

  //Routes
  app.route('/user/register')
    .post(userController.register);

  app.route('/user/login')
    .post(userController.login);
}