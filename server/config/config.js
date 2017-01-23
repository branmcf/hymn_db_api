//config.js

//const key = 'aeUwiVUch2123o91423aJ00uo9777223dsda';

//module.exports = key;

var fs = require('fs')

configPath = './config/config.json';

var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

//exports.storageConfig = parsed;

module.exports = parsed;