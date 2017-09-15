const net = require('net');
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

const PORT = '4000';

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

router.get('/', (req, res) => {
    res.json({ message: 'hello world' });
});

app.use('/api',router);
app.listen(PORT, () => {
    console.log('Business Server open !!!');
});

