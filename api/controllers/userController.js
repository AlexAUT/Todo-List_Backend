'use strcit';

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var getAPIError = require('./../errors');
const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret)
  throw new Error("You have to define the JWT_SECRET enviroment variable!");

var mongoose = require('mongoose');
const User = mongoose.model('User');

const checkPassword = (password) => {
  return password.length >= 6;
}

const checkEmail = (email) => {
  var regExp = /^[A-Za-z0-9]+$/;
  return email.match(regExp);
}

exports.register = function (req, res) {
  if (req.body && req.body.password) {
    // Check password and email/username requirements
    if(!checkPassword(req.body.password)) {
      res.status(500).send(getAPIError(10));
      return;
    }
    if(!checkEmail(req.body.email)) {
      res.status(500).send(getAPIError(11));
      return;
    }

    // Hash password
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err)
        res.status(500).send(getAPIError(0));
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) {
          res.status(500).send(getAPIError(0));
          return;
        }
        req.body.passwordHash = hash;
        req.body.password = undefined;
        const newUser = new User(req.body);
        newUser.save(function (err, user) {
          if (err) {
            res.status(500).send(getAPIError(1));
            return;
          }
          //Create indefinite token
          jwt.sign({
            data: { _id: user.id }
          }, jwt_secret, { expiresIn: '87600h' }, function (err, token) {
            if (err) {
              res.status(500).send(getAPIError(2));
              return;
            }
            user.token = token;
            res.json(user);
          });
        });
      });
    });
  } else {
    req.status(500).send(getAPIError(3));
  }
}

exports.login = function (req, res) {
  if (req.body && req.body.password && req.body.email) {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (err) {
        res.status(500).send(getAPIError(0));
      }
      else if (!user) {
        res.status(500).send(getAPIError(4));
      } else {
        console.log("User: ", user);
        bcrypt.compare(req.body.password, user.passwordHash, function (err, same) {
          if (err) {
            res.status(401).send(getAPIError(5));
          } else if (!same) {
            res.status(401).send(getAPIError(5));
          } else {
            jwt.sign({
              data: { _id: user.id }
            }, jwt_secret, { expiresIn: '87600h' }, function (err, token) {
              if(err)
              {
                res.status(500).send(getAPIError(0));
                return;
              }
              user.token = token;
              res.json(user);
            });
          }
        });
      }
    });
  } else {
    res.status(500).send(getAPIError(6));
  }
}
