const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const request = require('request');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));
app.use(express.static(__dirname + '/public'));

let users = {};

// Define your HTTP routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});


// Socket.io event handling
io.on('connection', (socket) => {
    // console.log('A user connected');

    socket.on('setUsername', (name) => {
        users[socket.id] = name.userName;
        console.log(name);
        io.emit('userJoined', name.userName);
    });

    socket.on('message', (message) => {
        const name = users[socket.id];
        io.emit('message', { name, message });
    });

    socket.on('disconnect', () => {
        const name = users[socket.id];
        delete users[socket.id];
        io.emit('userLeft', name);
        // console.log('A user disconnected');
    });
});


// Start the server
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
