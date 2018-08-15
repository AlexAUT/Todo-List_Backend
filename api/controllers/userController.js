'use strcit';

var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;
if(!jwt_secret)
    throw new Error("You have to define the JWT_SECRET enviroment variable!");

var mongoose = require('mongoose');
const User = mongoose.model('User');


exports.register = function(req, res) {
    if(req.body && req.body.password) {
        // Hash password
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err)
            res.status(500).send("Error in bcrypt salt generation!");
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                if(err)
                {
                    res.status(500).send("Error in bcrypt hash generation!");
                    return;
                }
                req.body.passwordHash = hash;
                req.body.password = undefined;
                const newUser = new User(req.body);
                newUser.save(function(err, user) {
                    if(err)
                    {
                        res.status(500).send(err);
                        return;
                    }
                    //Create indefinite token
                    jwt.sign({
                        data: { _id: user.id }
                      }, jwt_secret, { expiresIn: '87600h' }, function(err, token) {
                        user.token = token;
                        res.json(user);
                    });
                });
            });
        });
    } else {
        req.status(500).send("No password present in body!");
    }
}

exports.login = function(req, res) {
    if(req.body && req.body.password && req.body.email) {
        User.findOne({email: req.body.email}, function(err, user) {
            if(err) {
                res.status(500).send(err);
            }
            else if(!user) {
                res.status(500).send("No user found with this email!");
            } else {
                console.log("User: ", user);
                bcrypt.compare(req.body.password, user.passwordHash, function(err, same) {
                    if(err) {
                        res.status(500).send(err);
                    } else if (!same) {
                        res.status(401).send("The password did not match");
                    } else {
                        jwt.sign({
                            data: { _id: user.id }
                          }, jwt_secret, { expiresIn: '87600h' }, function(err, token) {
                            user.token = token;
                            res.json(user);
                        });
                    }
                });
            }
        });
    } else {
        res.status(500).send("Email and password must be present in the body!");
    }
}
