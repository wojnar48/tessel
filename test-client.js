const fs = require('fs');
const mqtt = require('mqtt');

// Create a config json object
const content = fs.readFileSync('.env.json', 'utf8');
const config = JSON.parse(content);

const client = mqtt.connect(config.MQTT_BROKER_URL)

client.on('connect', () => {
  client.subscribe('bme:connected');
  client.subscribe('bme:gauge');
});

client.on('message', (topic, message) => {
  switch (topic) {
    case 'bme:gauge':
      console.log(JSON.parse(message));
      return;
    default:
      console.log(`default: ${message}`);
  }
});