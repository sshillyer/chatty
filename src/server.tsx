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


// Routes
app.get('/', (req, res) => {
    // CITE: https://medium.com/@liheyse/react-server-side-rendering-ssr-with-express-and-css-modules-722ef0cc8fa0
    const appString: string = renderToString(<App />);

    res.send(template({
        body: appString,
        title: 'SSH Chat'
    }));
});

app.get('/:username', (req, res) => {
    const username = req.params.username;
    const appString: string = renderToString(<ChatInterface username={username} messages={messageHistory}/>);

    res.send(template({
        body: appString,
        title: 'SSH Chat'
    }));
});


// Listening with socket.io to all connections and handling the logic
io.on('connection', function (socket) {
    console.log('user connected');
    
    socket.on('user login', function (username: string) {
        handleUserLogin(username);
    });

    socket.on('chat message', function (msg: string) {
        handleMessageRequest(msg);
    });

    socket.on('user disconnected', function(username: string) {
        handleUserDisconnect(username);
    });
});

server.listen(8080);



// SocketIO Handlers
function handleUserLogin(username: string){
    console.log('Login request: ' + username);
    let loginMessage: string = 'User "' + username + '" has joined.';
    
    io.emit('chat message', loginMessage);

    messageHistory.push(loginMessage);
}

function handleMessageRequest(message: string) {
    console.log('Message: ' + message);
    
    let messageObject = new Message(message);

    io.emit('chat message', messageObject.toString());

    messageHistory.push(messageObject.toString());
}

function handleUserDisconnect(username: string) {
    let disconnectMessage: string = 'User ' + username + ' has disconnected';
    console.log(disconnectMessage);

    io.emit('chat message', disconnectMessage);
    messageHistory.push(disconnectMessage);
}
