// CITE: https://socket.io/get-started/chat/ 
// CITE: https://medium.com/@liheyse/react-server-side-rendering-ssr-with-express-and-css-modules-722ef0cc8fa0

import * as React from 'react';
import * as express from 'express';
import * as sio from 'socket.io';
import * as http from 'http';
import { renderToString } from 'react-dom/server';
import App from './components/app';
import template from './template';

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
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html'); // This line will render index.html in the build folder which was just a placeholder to test the sockets.io functionality / prototype of the interface.

    // BEGINNING OF CONCEPTS FROM https://medium.com/@liheyse/react-server-side-rendering-ssr-with-express-and-css-modules-722ef0cc8fa0
    const appString: string = renderToString(<App />);

    res.send(template({
        body: appString,
        title: 'SSH Chat'
    }));
    // END TUTORIAL STUFF
});


//  Setup simple array of strings to store the arrays in. TODO: Could make a UserMessage class that encapsulates username and message (+ timestamps etc.)
let messageHistory: string[] = [];


// Listening with socket.io to all connections and handling the logic
io.on('connection', function (socket) {
    console.log('user connected');
    
    socket.on('user login', function (username: string) {
        handleUserLogin(username);
    });

    socket.on('chat message', function (msg: string) {
        handleMessageRequest(msg);
    });

    socket.on('disconnect', function(username: string) {
        handleUserDisconnect(username);
    });
});

server.listen(8080);

// Handlers

function handleUserLogin(username: string){
    console.log('Login request: ' + username);
    let loginMessage: string = 'User "' + username + '" has joined.';
    
    io.emit('chat message', loginMessage);

    messageHistory.push(loginMessage);
    // messageHistory.forEach(msg => console.log(msg));
}

function handleMessageRequest(message: string) {
    console.log('Message: ' + message);

    io.emit('chat message', message);

    messageHistory.push(message);
    // messageHistory.forEach(msg => console.log(msg));
}

function handleUserDisconnect(username: string) {
    console.log('User has disconnected');
    let disconnectMessage: string = 'User has disconnected.';

    messageHistory.push(disconnectMessage);

}
