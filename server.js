const port = process.env.PORT || 5000;
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

var Auth0 = jwt({
  secret: jwks.expressJwtSecret({
    cache:true,
    rateLimit:true,
    jwksRequestsPerMinute:5,
    jwksUri: "https://safereef.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://project-safe-reef/',
    issuer: "https://safereef.auth0.com/",
    algorithms: ['RS256']
});


const app = express();
app.use(Auth0);

//Send a more user friendly response for unauthorized access
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({message:'Missing or invalid token'});
  }
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var db


//default to heroku mongodb uri if it exists otherwise testing locally
var dbConnectionString = "mongodb://localhost/db";
if(process.env.MONGODB_URI) {
 	dbConnectionString = process.env.MONGODB_URI;
}


MongoClient.connect(dbConnectionString,function(err,database){
	if(err){
		console.log(err)
		process.exit(1)
	}
	db = database
	routes = require('./app/routes')
  routes(app,db);
});

app.listen(port, () => {});
// If no route is matched by now, it must be a 404
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

module.exports = app;
