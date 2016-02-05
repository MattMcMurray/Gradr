// our routes
var api = require('./routes/api.js');
var pages = require('./routes/index.js');

// npm modules
var express = require('express');
var app = express();
var body_parser = require('body-parser');
var parseArgs = require('minimist');

// stub models
var stubUser = require('./stub_models/StubUser.js');
var stubLikes = require('./stub_models/StubUserMatches.js');

app.use(body_parser.urlencoded({ extended: true })); // tell node how we want to parse form data
app.use(body_parser.json()); // tell node to use json for form parsing
app.use(express.static(__dirname + '/public')); // tell express where the clientside files are

app.set('view engine', 'jade'); // tell node to use jade templating

// PORT 80 is reserved for the system; make sure you run 'sudo node main.js'
var port = process.env.PORT || 80;

app.use('/api', api.router); // tell node to use routes.js as our /api/ routes
app.use('/', pages.router); // tell node to use index.js for front facing pages

// run options
var args = parseArgs(process.argv.slice(2));
processOptions(args);

var server = app.listen(port, function() {
    console.log("App running on port " + server.address().port);
});

function processOptions(args) {
    var options = ['fill_database', 'clear_database', 'stub_users', 'stub_likes', 'stub_all'];
    var db = require('./database.js');


    // minimist uses '_' to hold any arguments not associated with an option, not needed
    delete args._; 

    for (var arg in args) {
        switch (arg) {
            case options[0]:
                db.fillDatabase(args.env);
                break;
            case options[1]:
                db.clearDatabase(args.env);
                break;
            case options[2]:
                api.injectUser(stubUser);
                console.log("RUNNING WITH USER DB STUBBED");
                break;
            case options[3]:
                api.injectLikes(stubLikes);
                console.log("RUNNING WITH LIKES TABLE STUBBED");
                break;
            case options[4]:
                api.injectLikes(stubUser);
                api.injectLikes(stubLikes);
                console.log("EVERYTHING IS A STUB!");
                break;
            default:
                console.log("Invalid option name specified. [%s]", arg);
                break;
        }
    }
}

// for importing into tests
module.exports = app;
