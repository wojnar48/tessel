require('dotenv').load()
const mqtt = require('mqtt')

// const client = mqtt.connect('mqtt://ec2-35-160-160-48.us-west-2.compute.amazonaws.com')
const client = mqtt.connect(process.env.MQTT_BROKER_URL)

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