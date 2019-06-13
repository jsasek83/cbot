


var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://kraken-mongo:yBuLYi3NWSngoRKAsnftM4pizdwh4GEXVQSQhS1S9tqMh5XU3xfYobJ5cg81gkQh8B9zuoXBR3QP3lSQOQ5GAA%3D%3D@kraken-mongo.documents.azure.com:10255/?ssl=true';

var insertDocument = function(db, callback) {
db.collection('feedback').insertOne( {
        "id": "JakesFeedback",
        "feedback": "Craig Rocks!",
        "sentiment": "positive"
    }, function(err, result) {
    assert.equal(err, null);
    console.log("Inserted a document into the families collection.");
    callback();
});
};

MongoClient.connect(url, function(err, client) {
    var db = client.db('kraken');
    insertDocument(db, function() {
                client.close();

})});
