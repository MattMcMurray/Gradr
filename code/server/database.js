var Sequelize = require("sequelize");
var fs = require('fs');

//connect to the sqlite database   
var sequelize = new Sequelize('study_database', 'softeng2', 'thisisencrypted', {
    host: 'localhost',
    dialect: 'sqlite',

    // pool: {
    //     max: ,
    //     min: 0,
    //     idle: 10000
    // },

    //Sqlite only
    storage: './study_database.sqlite'
});

var fillDatabase = function() {
    executeSQLScript(setPath('testusers'));
    executeSQLScript(setPath('testratings'));
    executeSQLScript(setPath('testmatches'));
    executeSQLScript(setPath('testmessages'));
}

var clearDatabase = function(env) {
    executeSQLScript(setPath('clear_database'));
}

function setPath(name) {
    return './dbscripts/' + name + '.sql';
}

function executeSQLScript(filename) {
    var query = fs.readFileSync(filename).toString();

    // Split string by semi-colons and remove any white-space, new lines, or empty values
    var lines = query.split(';').filter(function(e){ return e.replace(/(\r\n|\n|\r)/gm,"") });

    lines.forEach(function(line) {
        sequelize.query(line).spread(function(results, metadata) {
            //console.log(metadata);
        }).catch(function(error) {
            console.log("ERROR: Couldn't execute SQL command.\n%s", error);
            return;
        });
    });
}

module.exports = {
    sequelize: sequelize,
    fillDatabase: fillDatabase,
    clearDatabase: clearDatabase
} 