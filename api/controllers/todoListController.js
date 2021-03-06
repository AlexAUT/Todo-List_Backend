'use strcit';

var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret)
  throw new Error("You have to define the JWT_SECRET enviroment variable!");

var mongoose = require('mongoose');
var getAPIError = require('./../errors');
const TodoFile = mongoose.model('TodoListFile');

exports.fetchList = function (req, res) {
  if (req.headers && req.headers.token) {
    jwt.verify(req.headers.token, jwt_secret, function (err, decoded) {
      if (err) {
        res.status(500).send(getAPIError(7));
      }
      else {
        TodoFile.findOne({ owner: decoded.data._id }, function (err, todoList) {
          if (err || !todoList) {
            //Create a new file
            const todoFile = {
              owner: decoded.data._id,
            };
            const newFile = new TodoFile(todoFile);
            newFile.save(function (err, file) {
              if (err) {
                res.status(500).send(getAPIError(0));
              } else {
                res.send(file);
              }
            });
          } else {
            res.json(todoList);
          }
        })
      }
    });

  }
  else {
    res.status(401).send(getAPIError(8));
  }
}

exports.updateList = function (req, res) {
  if (req.headers && req.headers.token) {
    jwt.verify(req.headers.token, jwt_secret, function (err, decoded) {
      if (err) {
        res.status(500).send(err);
      }
      else {
        if (decoded.data._id !== req.body.owner) {
          res.status(500).send(getAPIError(9));
        } else {
          TodoFile.findOneAndUpdate({ owner: req.body.owner }, req.body, { new: true }, function (err, todoList) {
            if (err) {
              res.status(500).send(getAPIError(0));
            } else {
              res.send(todoList);
            }
          });
        }
      }
    });

  }
  else {
    res.status(401).send(getAPIError(8));
  }
}
