// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class MongoDbHelper  {

    async queryDeli(queryString){

        var url = 'mongodb://kraken-mongo:yBuLYi3NWSngoRKAsnftM4pizdwh4GEXVQSQhS1S9tqMh5XU3xfYobJ5cg81gkQh8B9zuoXBR3QP3lSQOQ5GAA%3D%3D@kraken-mongo.documents.azure.com:10255/?ssl=true';
        const MongoClient = require('mongodb').MongoClient;

        async function findOne() {

            const client = await MongoClient.connect(url, { useNewUrlParser: true })
                .catch(err => { console.log(err); });

            if (!client) {
                console.log("Something went wrong");
                return;
            }

            try {
                const db = client.db("kraken");
                let collection = db.collection('deliMenusDates');
                let res = await collection.findOne(queryString);
                return res;
            } catch (err) {
            } finally {
                client.close();
            }

            return;
        }

        return await findOne(); 

    }
}

module.exports.MongoDbHelper = MongoDbHelper;
