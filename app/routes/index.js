
const UserRoutes = require('./user_routes');

module.exports = function(app,db) {
	UserRoutes(app,db);
}
