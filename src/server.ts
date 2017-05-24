import * as express from 'express';
import * as sio from 'socket.io';
import * as http from 'http';

// TODO: Could encapsulate this into a server class
const serverPort: number = process.env.PORT || 3000;
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIO.Server = sio(server);

// Run the "app"
app.listen(serverPort, () => {
    console.log('Listening at http://localhost:' + serverPort + '/'); // TODO: The replacement isn't happening here
});


// Routes
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



// Listening with socket.io
io.on('connection', function (socket) {
    console.log('user connected');
    
    // socket.on('client event', function (data: string) {
    //     socket.broadcast.emit('update label', data);
    // });

    socket.on('chat message', function (msg: string) {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

server.listen(8080);
