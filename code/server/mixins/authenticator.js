var bcrypt = require("bcrypt")
var authenticate = function(submittedPassword, hashedPassword) {
	return bcrypt.compareSync(submittedPassword, hashedPassword);
}

module.exports = {
	authenticate: authenticate
}