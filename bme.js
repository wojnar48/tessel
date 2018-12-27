require('dotenv').load()
const Tessel = require("tessel-io");
const five = require("johnny-five");
const mqtt = require('mqtt');

// TODO(SW): Move the URL into a .env file
const client = mqtt.connect(process.env.MQTT_BROKER_URL);

const board = new five.Board({
  io: new Tessel(),
  repl: false,
  debug: false,
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

    let lastUpdated = Date.now() - 5000;

    monitor.on('change', function() {
      let now = Date.now();

      // If we are more than 5 seconds from the last update, publish new sensor data
      if (now - lastUpdated >= 5000) {
        lastUpdated = now;

        client.publish('bme:thermometer', `${monitor.thermometer.fahrenheit}`);
        client.publish('bme:barometer', `${monitor.barometer.pressure}`);
        client.publish('bme:hygrometer', `${monitor.hygrometer.relativeHumidity}`);
      }
    });

  });
});
