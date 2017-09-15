const redis = require('redis');
const RDS_PORT = 6379;
const RDS_HOST = '127.0.0.1';

const client = redis.createClient(RDS_PORT,RDS_HOST);

client.on('ready', (res) => {
    console.log('redis 6379 connected');
});