const {MongoClient} = require('mongodb');
const client = new MongoClient(process.env.MONGO_URL);
client.connect();
let db = client.db("todos");
module.exports = db;