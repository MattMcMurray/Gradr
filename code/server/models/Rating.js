var Sequelize = require('sequelize');
var connection = require('../database.js');
var User = require('./User.js');

RatingConnection = connection.define('ratings', {
  num_ratings: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: false
  },
  total_score: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: false
  }, 
  user: {
    type: Sequelize.INTEGER,
    references: {
      model: 'user',
      key: 'id'
     }
  }

});

RatingConnection.sync();


var addUserScore = function(user_id, score) {
  RatingConnection.findOne({
    where: {
      user: user_id
    }
  }).then(function(user) {
    if (!user) {
      RatingConnection.create({
        num_ratings: 1,
        total_score: score,
        user: user_id
      });
    } else {
      user.increment('num_ratings');
      user.increment('total_score', {by: score});
    }
  });
}

var getUserScore = function(user_id) {
  return RatingConnection.findOne({
    where: {
      user: user_id
    }
  });
}

module.exports = {
  addUserScore: addUserScore,
  getUserScore: getUserScore
}

