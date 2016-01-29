var Sequelize = require('sequelize');
var connection = require('../database.js');
var User = require('./User.js');

RatingConnection = connection.define('ratings', {
  username: {
    type: Sequelize.STRING,

  }
});
