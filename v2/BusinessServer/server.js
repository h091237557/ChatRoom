const net = require('net');
const http = require('http');
const mime = require('mime');
const path = require('path');
const fs = require('fs');

const HOST = '127.0.0.1';
const MESSAGE_PORT = '60001';
const PORT = '50000';

let cache = {};

function send404(res){
    res.writeHead(404);
    res.write('Error 404');
    res.end();
}

function sendFile(res, file_path, file_contents){
    res.writeHead(
        200,
        { "content-type" : mime.getType(path.basename(file_path)) }
    );
    res.end(file_contents);
}

function serverStatic(res, cache, abs_path) {
    if(cache[abs_path]){
        sendFile(res, abs_path, cache[abs_path]);
    } else{
        const is_exist = fs.existsSync(abs_path);
        if(is_exist){
            const data =  fs.readFileSync(abs_path);
            cache[abs_path] = data;
            sendFile(res, abs_path, data);
        }else{
            send404(res);
        }
    }
}

const app = http.createServer((req,res) => {
    console.log('Send requrest to the business server');

    let file_path ;
    if ( req.url === '/'){
        file_path = '/public/index.html';
    }else{
        file_path = `/public/${req.url}`;
    }
    const abs_path = path.resolve(`./${file_path}`);
    serverStatic(res, cache, abs_path);
}).listen(PORT, HOST, () => {
    console.log('Business Server open !');
});

const client = net.Socket();
client.connect(MESSAGE_PORT, HOST, ()=>{
    console.log('client connected');
    client.write('I am Mark');
});

client.on('close', () => {
    console.log('close client');
});