var bcrypt = require("bcrypt")
var authenticate = function(submittedPassword, hashedPassword) {
	return bcrypt.compareSync(submittedPassword, hashedPassword);
}

var encrypt = function(password) {
	var salt = bcrypt.genSaltSync(10);
	var hash = bcrypt.hashSync(password, salt);
	return hash;
}
module.exports = {
	authenticate: authenticate,
	encrypt: encrypt
}