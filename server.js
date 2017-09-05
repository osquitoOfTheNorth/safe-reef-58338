const port = process.env.PORT || 5000;
const express = require('express');
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser').MongoClient

const app = express();
app.listen(port, () => {
	console.log("Live on the internet!!");
})