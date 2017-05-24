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
    // For now we just send a static page with embedded js that allows user to go back and forth
    // TODO: Make this render a REACT component composed of the login screen and boilerplate template
    res.sendFile(__dirname + '/index.html');
});




// Listening with socket.io to all connections and handling the logic
/* TODO:
 * 1. 'username message' handling. Add user to list of users?
 * 2. When user logs in, add "user 'x' has logged in" to chat history in local storage
 * 3. When chat message is received,  add it to the message history in local storage
 * 4. In either event, how do we notify the other clients about what's happened?
 *
 */
io.on('connection', function (socket) {
    console.log('user connected');
    
    socket.on('user login', function (username: string) {
        console.log('Login request: ' + username);
    });

    socket.on('chat message', function (msg: string) {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

server.listen(8080);

