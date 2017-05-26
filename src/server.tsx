// Some doc's referenced
// CITE: https://socket.io/get-started/chat/ 
// CITE: https://medium.com/@liheyse/react-server-side-rendering-ssr-with-express-and-css-modules-722ef0cc8fa0
// CITE: https://scotch.io/tutorials/react-on-the-server-for-beginners-build-a-universal-react-and-node-app
// CITE: https://medium.com/@liheyse/react-server-side-rendering-ssr-with-express-and-css-modules-722ef0cc8fa0

import * as React from 'react';
import * as express from 'express';
import * as sio from 'socket.io';
import * as http from 'http';
import { renderToString } from 'react-dom/server';

// React components
import App from './components/app';
import ChatInterface from './components/ChatInterface';
import template from './template';

// Data model(s)
import Message from './models/Message';

//  Setup simple array of strings to store the arrays in. TODO: Could make a UserMessage class that encapsulates username and message (+ timestamps etc.)
let messageHistory: string[] = [];

// TODO: Encapsulate this into a server class that instantiates the server and listener
const serverPort: number = process.env.PORT || 3000;
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const io: SocketIO.Server = sio(server);

// Run the "app"
app.listen(serverPort, () => {
    console.log('Listening at http://localhost:' + serverPort + '/'); // TODO: The replacement isn't happening here
});


// Pre-renders App (containing only UserLogin component)
app.get('/', (req, res) => {
    const appString: string = renderToString(<App />);

    res.send(template({
        body: appString,
        title: 'SSH Chat'
    }));
});

// Pre-rendesr React ChatInterface component
app.get('/:username', (req, res) => {
    const username = req.params.username;
    const appString: string = renderToString(<ChatInterface username={username} messages={messageHistory}/>);

    res.send(template({
        body: appString,
        title: 'SSH Chat'
    }));
});


// Socket.IO listens for events emitted by client-side JavaScript calls
io.on('connection', function (socket) {
    console.log('Socket IO connection established');
    
    socket.on('user:login', function (username: string) {
        handleUserLogin(username, socket.id);
    });

    socket.on('message:send', function (msg: string) {
        handleMessageRequest(msg);
    });

    socket.on('user:disconnect', function(username: string) {
        handleUserDisconnect(username);
    });

    socket.on('retrieve:history', function() {
        handleRetreiveHistory(socket.id);
    })
});

server.listen(8080);


// SocketIO Handlers
function handleUserLogin(username: string, socketId: string){
    if (username != null && /\S/.test(username)) {
        console.log('Login request: ' + username);
        let loginMessage: string = 'User "' + username + '" has joined.';
        io.to(socketId).emit('login:success', username);
        io.emit('message:received', loginMessage);
        messageHistory.push(loginMessage);
        console.log(username + ' logged in.');
    }  else {
        io.to(socketId).emit('login:failure', 'invalid username');
    }
}

function handleMessageRequest(message: string) {
    console.log(message);
    
    let messageObject = new Message(message);

    io.emit('message:received', messageObject.toString());

    messageHistory.push(messageObject.toString());
}

function handleUserDisconnect(username: string) {
    let disconnectMessage: string = 'User ' + username + ' has disconnected';
    console.log(disconnectMessage);

    io.emit('message:received', disconnectMessage);
    messageHistory.push(disconnectMessage);
}

function handleRetreiveHistory(socketId: string) {
    io.to(socketId).emit('history:success', messageHistory);
}