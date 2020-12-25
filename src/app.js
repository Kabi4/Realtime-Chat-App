require('dotenv').config({ path: __dirname + '/.env' });
const http = require('http');
const Filter = require('bad-words');
const express = require('express');
const moment = require('moment');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// let users = 0;
// let string = '';

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public'))); //setting the static path to look for at last when no where link to be found

io.on('connection', (socket) => {
    socket.broadcast.emit('message', 'New User Joined the chat.');
    const welcomeString =
        'Welcome to the chat up we hope you bought some pizza with you!';
    socket.emit('message', welcomeString);
    socket.on('sendMessage', (msg, isLocation, timeStamp, callback) => {
        const filter = new Filter();
        const createdAt = moment(timeStamp).format('h:mm a');
        if (filter.isProfane(msg)) {
            return callback('error');
        }
        io.emit('chatMessage', msg, isLocation, createdAt);
        callback();
    });
    socket.on('disconnect', function () {
        socket.broadcast.emit('message', 'A user has left the chat!');
    });
    // socket.emit('updatedCount', users);
    // socket.on('notify', () => {
    //     users++;
    //     // socket.emit('updatedCount', users);
    //     io.emit('updatedCount', users);
    // });
});

app.get('/', (req, res) => {
    res.send('index.html');
});

module.exports = server;
