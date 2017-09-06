const newUserRoute = require("./user_routes");

module.exports = function(app,db) { 
	newUserRoute(app,db);
}