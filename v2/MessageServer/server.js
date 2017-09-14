const net = require('net');
const http = require('http');
const HOST = '127.0.0.1';
const PORT_CLIENT = '60000';
const PORT_BUSS_SERVER = '60001';


const app = net.createServer((socket)=>{
    socket.on('data', (data) => {
        console.log('I received data from Business Server');
    });

}).listen(PORT_BUSS_SERVER, HOST, () =>{
    console.log('Message Server Open !');
});

const websocket_app =  http.createServer((req,res) => {
    res.write('hello');
}).listen(PORT_CLIENT, HOST, () => {
});

const io = require('socket.io')(websocket_app);
io.on('connection', (socket) =>{
    console.log('websocket connected');
    socket.on('test', (data) => {
        console.log('Receved' + data);
    });

});


