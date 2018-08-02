'use strict'
module.exports = function(app) {
    var todoList = require("../controllers/todoListController");

    //Routes
    app.route('/todoList')
        .get(todoList.fetchList)
        .put(todoList.updateList)
}