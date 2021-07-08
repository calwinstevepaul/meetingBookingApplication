const mongoose = require('mongoose');
const nconf = require('nconf');

module.exports = async function (resolve, reject) {
    try {
      let db = nconf.get('db');
    let dbConnected = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log(`Connected to ${db}`);
    resolve(true);

  } catch (error) {
    console.log('error :', error);
    reject(error);
  } 

}