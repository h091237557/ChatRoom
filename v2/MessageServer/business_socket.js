const net = require('net');
const HOST = '127.0.0.1';
const PORT_BUSINESS_SEVER = '3001';

const app = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log('I have received data from Business Server : ' + data);
    });
}).listen(PORT_BUSINESS_SEVER,HOST, () => {
    console.log('Business Server socket open !');
});