const Datastore = require('nedb');
const fs = require('fs');
const https = require('https');
const querystring = require('querystring');

exports.sensorToId = sensor => typeof sensor === 'object' ? sensor.id : sensor;
exports.downloadHistory = (config, db) => {

  config.sensors.forEach(sensor => {

    let sensorId = exports.sensorToId(sensor);
    console.log(sensorId);
    let query = querystring.stringify({
      apikey: config.apikey,
      sensorId: sensorId,
      historyHours: 24,
      historyResolutionHours: 1
    })

    let request = https.get({
      headers: {
        accept: 'application/json'
        // apikey: config.apikey
      },
      hostname: 'airapi.airly.eu',
      path: `/v1/sensor/measurements?${query}`
    }, result => {
      console.log(result.statusCode);
      result.setEncoding('utf8');
      let rawData = '';
      result.on('data', (chunk) => rawData += chunk);
      result.on('end', () => {
        try {
          let data = JSON.parse(rawData);
          data.history.forEach(hist => {
            db.history[sensorId].insert(hist);
          });
        } catch (e) {
          console.log(e.message);
        }
      });
    })

  });

}
exports.exportHistoryCSV = (config, db) => {

  Object.keys(db.history).forEach(sensorId => {
    db.history[sensorId].find({})
      .exec((err, docs) => {
        let rows = [...docs.map(data => ({
          sensorId: sensorId,
          fromDateTime: data.fromDateTime,
          tillDateTime: data.tillDateTime,
          airQualityIndex: data.measurements.airQualityIndex,
          pm1: data.measurements.pm1,
          pm25: data.measurements.pm25,
          pm10: data.measurements.pm10,
          pressure: data.measurements.pressure,
          humidity: data.measurements.humidity,
          temperature: data.measurements.temperature,
          pollutionLevel: data.measurements.pollutionLevel
        }))];

        let strRows = [Object.keys(rows[0]).join(';'), ...rows.map(row => (
          Object.keys(row).map(fieldName => (row[fieldName])).join(';')
        ))].join("\n");
        fName = `exports/history_${sensorId}.csv`;
        try {
          fs.accessSync('exports')
        } catch (e) {
          fs.mkdirSync('exports');
        }
        fs.writeFile(fName, strRows, (err) => {
          if (err) console.error(`Failed to save ${fName}, ${err}`);
          else console.log(`Saved ${fName}`);
        })
      })
  })

}