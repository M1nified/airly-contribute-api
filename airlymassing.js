const fs = require('fs');

const Airly = require('airly');

function getMeasurementValue(measurements, name) {
  for (const measurement of measurements) {
    if (measurement.name.toLowerCase() === name.toLowerCase())
      return measurement.value;
  }
}

exports.sensorToId = sensor => typeof sensor === 'object' ? sensor.id : sensor;
exports.downloadHistory = (config, db) => {

  const airly = new Airly(config.apikey);

  config.sensors.forEach(sensor => {

    let sensorId = exports.sensorToId(sensor);
    console.log(sensorId);
    airly.idData(sensor)
      .then(data => {
        data.history.forEach(hist => {
          db.history[sensorId].insert(hist);
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
          AIRLY_CAQI: getMeasurementValue(data.indexes, 'AIRLY_CAQI'),
          pm1: getMeasurementValue(data.values, 'pm1'),
          pm25: getMeasurementValue(data.values, 'pm25'),
          pm10: getMeasurementValue(data.values, 'pm10'),
          pressure: getMeasurementValue(data.values, 'pressure'),
          humidity: getMeasurementValue(data.values, 'humidity'),
          temperature: getMeasurementValue(data.values, 'temperature'),
          pollutionLevel: getMeasurementValue(data.values, 'pollutionLevel')
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