const mongoose = require('mongoose');

// Bypassing SRV DNS lookup since it's blocked in this environment
const uri = "mongodb://geniusappsolu:sslj@ac-c4xs8lc-shard-00-00.dqkklnk.mongodb.net:27017,ac-c4xs8lc-shard-00-01.dqkklnk.mongodb.net:27017,ac-c4xs8lc-shard-00-02.dqkklnk.mongodb.net:27017/sslj?ssl=true&replicaSet=atlas-c4xs8lc-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB using standard URI!");
    const db = mongoose.connection.db;
    
    const collections = ['products', 'categories', 'banners'];
    for (const name of collections) {
      console.log(`\n--- First document of ${name} ---`);
      const coll = db.collection(name);
      const doc = await coll.findOne({});
      console.log(JSON.stringify(doc, null, 2));
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
