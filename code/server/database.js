var Sequelize = require("sequelize");
var fs = require('fs');

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

var fillDatabase = function() {
    var addUserQuery = fs.readFileSync('dbscripts/testusers.sql').toString();

    // Split string by semi-colons and remove any white-space, new lines, or empty values
    var inserts = addUserQuery.split(';').filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"") });

    inserts.forEach(function(insert) {
        sequelize.query(insert).spread(function(results, metadata) {
            //console.log(metadata);
        }).catch(function(error) {
            console.log("ERROR: Couldn't execute SQL command.\n%s", error);
            return;
        });
    });
}

var clearDatabase = function() {
    var clearUserQuery = "DELETE FROM users";

    sequelize.query(clearUserQuery).spread(function(results, metadata) {
        //console.log(metadata);
    }).catch(function(error) {
        console.log("ERROR: Couldn't execute SQL command.\n%s", error);
        return;
    });
}

module.exports = {
    sequelize: sequelize,
    fillDatabase: fillDatabase,
    clearDatabase: clearDatabase
} 