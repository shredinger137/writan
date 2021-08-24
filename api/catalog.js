
var express = require("express");
var app = express();
var config = require("./config.js");
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
app.use(express.json());

var dbConnection = null;
MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) { console.error(err) }
    dbConnection = client.db(config.globalDbName) // once connected, assign the connection to the global variable
    connectedToDatabase = true;

    //things that happen on startup should happen here, after the database connects
})

module.exports = {

//functions go here


}