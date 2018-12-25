
const config = require('./config.json');

const airlymassing = require('./airlymassing.js');

const Datastore = require('nedb');

const db = {
    history: {}
};
config.sensors.forEach(sensor => {
    let sensorId = airlymassing.sensorToId(sensor);
    db.history[sensorId] = new Datastore({
        filename: (config.pathHistoryDb || 'data') + '/history_' + sensorId + '.nedb',
        autoload: true
    })
    db.history[sensorId].ensureIndex({
        fieldName: 'fromDateTime',
        unique: true
    });
})

if (process.argv[2] === 'download') {
    airlymassing.downloadHistory(config, db);
} else if (process.argv[2] === 'export') {
    airlymassing.exportHistoryCSV(config, db);
} else {
    console.info(`Usage: node index [download|export] `);
}