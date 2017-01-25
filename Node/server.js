var http = require('http');
var Mongo = require('mongodb').MongoClient;
var express = require('express');

var mongo_url = 'mongodb://localhost:27017/apcsp';

Mongo.connect(mongo_url, function(err, db) {
  if(err) {
    console.log('MongoDB connection error');
  } else {
    console.log('Connected to MongoDB');
  }
}); 

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.listen(3000, function() {
  console.log('listening on 3000');
});