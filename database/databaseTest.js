// import and init database packages
var Sequelize = require('sequelize');
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


//define the tables
Student = sequelize.define('student', {
    firstName: {
        type: Sequelize.STRING,
    },
    lastName: {
        type: Sequelize.STRING
    }
});

School = sequelize.define('school', {
    name: {
        type: Sequelize.STRING,
    },
    type: {
        type: Sequelize.STRING
    }
})

//set the relationship
School.hasMany(Student)


//creating the tables and adding entries to them
sequelize.sync({force: true}).then(function() {
        
        School.create({
            name: "University of Manitoba"
        });
        

}).catch(function(error) {
    console.log("Something went wrong during model synchronization");
});





