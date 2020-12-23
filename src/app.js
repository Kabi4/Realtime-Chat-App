require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public'))); //setting the static path to look for at last when no where link to be found

app.get('/', (req, res) => {
    res.send('index.html');
});

module.exports = app;
