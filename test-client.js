const fs = require('fs');
const mqtt = require('mqtt');

// Create a config json object
const content = fs.readFileSync('.env.json', 'utf8');
const config = JSON.parse(content);

const client = mqtt.connect(config.MQTT_BROKER_URL)

client.on('connect', () => {
  client.subscribe('bme:connected');
  client.subscribe('bme:thermometer');
  client.subscribe('bme:barometer');
  client.subscribe('bme:hygrometer');
});

client.on('message', (topic, message) => {
  switch (topic) {
    case 'bme:thermometer':
      console.log(`thermometer: ${message}`);
      return;
    case 'bme:barometer':
      console.log(`barometer: ${message}`);
      return;
    case 'bme:hygrometer':
      console.log(`hygrometer: ${message}`);
      return;
    default:
      console.log(`default: ${message}`);
  }
});