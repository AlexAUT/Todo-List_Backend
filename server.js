const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const UserModel = require('./api/models/userModel');
const TodoListModel = require('./api/models/todoListModel');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Todo_db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userRoutes = require('./api/routes/userRoutes');
userRoutes(app);
var todoListRoutes = require('./api/routes/todoListRoutes');
todoListRoutes(app);

app.listen(port);

console.log("Listen on port: " + port);
