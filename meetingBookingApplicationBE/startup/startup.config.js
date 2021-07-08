const nconf = require('nconf');

module.exports = async function () {
   nconf.argv().env().file({ file: __dirname + '/../config/config.json' });
}
