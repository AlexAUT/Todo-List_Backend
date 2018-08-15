'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TodoListSchema = new Schema({
  owner: {
    type: String,
  },
  content: {
    type: String,
    default: '',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  modifiedDate: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('TodoListFile', TodoListSchema);