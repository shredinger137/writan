const express = require("express");
const app = express();
const config = require("./config.js");
const MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
app.use(express.json());
var admin = require("firebase-admin");
var serviceAccount = require("./data/credentials.json");

const userFunctions = require('./users'); 
const catalogFunctions = require('./catalog');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

var dbConnection = null;
MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) { console.error(err) }
    dbConnection = client.db(config.globalDbName) // once connected, assign the connection to the global variable
    connectedToDatabase = true;
    console.log("Connected to database " + config.globalDbName);

    //things that happen on startup should happen here, after the database connects
})

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});



app.post('/user', function (req, res) {
    if(req.body && req.body.email){
        userFunctions.createUserEntry(req.body).then(result => {
            if(result){
                res.send(true);
            } else {
                res.send(false);
            }
        })
    }
})


app.listen(config.port);