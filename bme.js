const path = require('path');
const Tessel = require("tessel-io");
const five = require("johnny-five");
const mqtt = require('mqtt');
const fs = require('fs');

// Create a config json object
const content = fs.readFileSync(path.join(__dirname, '.env.json'));
const config = JSON.parse(content);

const client = mqtt.connect(config.MQTT_BROKER_URL);

const board = new five.Board({
  io: new Tessel(),
  repl: false,
  // debug: false,
});

// When the board is done initializing and ready to read sensor data
board.on('ready', () => {
  // Instantiate an instance of the multi class to govern interaction with the
  // BME280 sensor
  // TODO(SW): Configure the elevation option
  const monitor = new five.Multi({
    controller: 'BME280'
  });

  client.on('connect', () => {
    client.publish('bme:connected', 'true');

    // Publish sensor data every 2 seconds
    setInterval(() => {
      const data = {
        temperature: monitor.thermometer.fahrenheit,
        pressure: monitor.barometer.pressure,
        humidity: monitor.hygrometer.relativeHumidity,
      };

      client.publish('bme:gauge', `${JSON.stringify(data)}`);
    }, 2000);
  });
});
