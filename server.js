const port = process.env.PORT || 5000;
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser').MongoClient

const app = express();
var db



MongoClient.connect(process.env.MONGODB_URI,function(err,database){
	if(err){
		console.log(err)
		process.exit(1)
	}
	db = database
	require('./app/routes') (app,db);
})


app.listen(port, () => {
})
