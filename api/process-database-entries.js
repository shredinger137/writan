var fs = require('fs');
var parse = require('csv-parse');
const readline = require('readline');
var MongoClient = require('mongodb').MongoClient, Server = require('mongodb').Server;
const LanguageDetect = require('languagedetect');

var dbConnection = null;
MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) { console.error(err) }
    dbConnection = client.db('writan')
    connectedToDatabase = true;

    processLineByLine();
})

const lngDetector = new LanguageDetect();

async function processLineByLine() {

    let results = false;

    const fileStream = fs.createReadStream('works.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {

        results = false;

        let entryData = JSON.parse(line.split('\t')[4]);
        if(entryData.title){
            results = lngDetector.detect(entryData.title);
        } 


        if (results && results[0] && results[0][0] && results[0][1] && results[0][0] == 'english' && results[0][1] >= .4) {
            delete entryData.created;
            delete entryData.revisions;
            delete entryData.latest_revision;
            delete entryData.last_modified;
            delete entryData.revision;

            if (dbConnection) {
                dbConnection.collection("library").insertOne(entryData, function (err, result) {
                    if (err) throw err;
                    return true;
                }
                )
            }

        }

    }

    console.log("Data ingestion complete")
}

