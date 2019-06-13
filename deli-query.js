const { MongoDbHelper } = require('./dialogs/mongoDbHelper');

var mh = new MongoDbHelper();

async function start(){
    var data = await mh.queryDeli({"date" : "6/10/2019 "});
    console.log(data);
}

start();

