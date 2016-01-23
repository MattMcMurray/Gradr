var Sequelize = require("sequelize");
var sqlite3 = require("sqlite3");

//connect to the sqlite database   
var sequelize = new Sequelize('study_database', 'softeng2', 'thisisencrypted', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    //Sqlite only
    storage: './study_database.sqlite'
});

User = sequelize.define('user', {
	username: {
		type: Sequelize.String,
	}
});

