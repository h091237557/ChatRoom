const net = require('net');
const client = net.Socket();

const HOST = '127.0.0.1';
const MESSAGE_PORT = '3001';
const PORT = '4000';

client.connect(MESSAGE_PORT, HOST, ()=>{
    console.log('client connected');
    client.write('I am Mark');
});

client.on('close', () => {
    console.log('close client');
});