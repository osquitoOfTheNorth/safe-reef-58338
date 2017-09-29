const port = process.env.PORT || 5000;
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser').MongoClient
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
	require('./app/routes') (app,db);
})

// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.listen(port, () => {
})
