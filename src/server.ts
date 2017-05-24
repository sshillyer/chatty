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


//  Setup simple array of strings to store the arrays in. TODO: Could make a UserMessage class that encapsulates username and message (+ timestamps etc.)
let messageHistory: string[] = [];


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
        handleUserLogin(username);
    });

    socket.on('chat message', function (msg: string) {
        handleMessageRequest(msg);
    });

    socket.on('disconnect', function() {
        handleUserDisconnect();
    });
});

server.listen(8080);

// Handlers

function handleUserLogin(username: string){
    console.log('Login request: ' + username);
    let loginMessage: string = 'User "' + username + '" has joined.';
    
    io.emit('chat message', loginMessage);

    messageHistory.push(loginMessage);
    messageHistory.forEach(msg => console.log(msg));
}


function handleMessageRequest(message: string) {
    console.log('Message: ' + message);

    io.emit('chat message', message); // TODO: Will probably pass props to a REACT view or maybe just re-render entire page? (Seems inefficient)

    messageHistory.push(message);
    messageHistory.forEach(msg => console.log(msg));
}


function handleUserDisconnect() {
    console.log('user disconnected');
}
