//This processes data dumps from Open Library. Current version assumes database does not exist.

//We check if the title appears to be english or the confidence of the language is low (could be english) and only write those. For now this isn't for all languages.

var fs = require('fs');
var parse = require('csv-parse');
const readline = require('readline');
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
const LanguageDetect = require('languagedetect');
const fetch = require('node-fetch');
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-west-1' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });


var dbConnection = null;
MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) { console.error(err) }
    dbConnection = client.db('writan')
    connectedToDatabase = true;

    let total = 0;

    const lngDetector = new LanguageDetect();

    let results = false;

    const fileStream = fs.createReadStream('works.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });


    rl.on('line', function (line) {

        total++;

        results = false;

        let entryData = JSON.parse(line.split('\t')[4]);
        if (entryData.title) {
            results = lngDetector.detect(entryData.title);
        }

        delete entryData.created;
        delete entryData.revisions;
        delete entryData.latest_revision;
        delete entryData.last_modified;
        delete entryData.revision;
        delete entryData.type;

        if (entryData.authors) {
            let authorList = [];

            entryData.authors.forEach(entry => {
                if (entry.author && entry.author.key) {
                    authorList.push(entry.author.key.replace(`/authors/`, ``));
                }
            })

            entryData.authors = authorList;

        }


        entryData.key = entryData.key.replace(`/works/`, "");

        if (results && results[0] && results[0][0] && results[0][1]) {

            if (results[0][0] == 'english' || results[0][1] <= .2) {

                let data = JSON.stringify(entryData);

                fetch(`https://search-writan-library-6nuqsq6ggx34ejgixfiirs5mc4.us-west-1.es.amazonaws.com/books/_doc/${entryData.key}`, {
                    method: 'PUT',
                    body: data,
                    headers: { 'Content-Type': 'application/json' }
                }).then(res => {
                    dbConnection.collection("library").updateOne({ key: entryData.key }, { $set: entryData }, { upsert: true }, function (err, result) {
                        if (err) throw err;
                        return true;
                    }
                    )
                }

                )
                    .catch(err => console.log(err))

            }
        }
    })


    rl.on('close', function () {
        console.log(total + ` complete`);
    })


})


//curl -XPUT -u 'master-user:master-user-password' 'domain-endpoint/movies/_doc/1' -d '{"director": "Burton, Tim", "genre": ["Comedy","Sci-Fi"], "year": 1996, "actor": ["Jack Nicholson","Pierce Brosnan","Sarah Jessica Parker"], "title": "Mars Attacks!"}' -H 'Content-Type: application/json'
//That's the example we have for adding data to Elasticsearch
//Endpoint: https://search-writan-library-6nuqsq6ggx34ejgixfiirs5mc4.us-west-1.es.amazonaws.com

/*
                dbConnection.collection("library").updateOne({ key: entryData.key }, { $set: entryData }, { upsert: true }, function (err, result) {
                    if (err) throw err;
                    return true;
                }
                )
        */