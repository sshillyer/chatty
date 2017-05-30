// Some doc's referenced
// CITE: https://socket.io/get-started/chat/ 

import * as express from 'express';
import * as path from 'path';
import * as sio from 'socket.io';
import * as http from 'http';
import * as redis from 'redis';


// Data model(s)
import Message from './models/Message';


//  Setup simple array of strings to store the arrays in. TODO: Could make a UserMessage class that encapsulates username and message (+ timestamps etc.)
let messageHistory: string[] = [];

// TODO: Encapsulate this into a server class that instantiates the server and listener
const serverPort: number = process.env.PORT || 3001;
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const socketIOPort: number = process.env.PORT || 8080;
const io: SocketIO.Server = sio(server);
const dbClient: any = redis.createClient();


// Set server to dish up the React App at root using static build folder
app.use(express.static(path.join(__dirname, '../chat2/build')));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../chat2/build', 'index.html'));
});

app.listen(serverPort);

// Attempt to connect to Redis server
dbClient.on('error', (err: any) => console.log(err) );


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

server.listen(socketIOPort);


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






// Cannot figure out why 'this' isn't binding in the functions (including just the socket.on(connection) section)



// class Server {
//     messageHistory: string[];
//     serverPort: number;
//     socketIoPort: number;
//     app: express.Application;
//     server: http.Server;
//     io: SocketIO.Server;

//     constructor() {
//         this.setupChatServer = this.setupChatServer.bind(this);
//         this.setupSocketIOListener = this.setupSocketIOListener.bind(this);
//         // this.handleUserLogin = this.handleUserLogin.bind(this);
//         // this.handleMessageRequest = this.handleMessageRequest.bind(this);
//         // this.handleUserDisconnect = this.handleUserDisconnect.bind(this);
//         // this.handleRetreiveHistory = this.handleRetreiveHistory.bind(this);
//     }

//     init(this: Server) {
//         this.setupChatServer();
//         this.setupSocketIOListener();
//     }

//     setupChatServer= () => {
//         this.socketIoPort = process.env.PORT || 8080;
//         this.serverPort = process.env.PORT || 3001;
//         this.app = express();
//         this.server = http.createServer(this.app);
//         this.io = sio(this.server);

//         this.app.use(express.static(path.join(__dirname, '../chat2/build')));

//         this.app.get('/', function(req, res) {
//             res.sendFile(path.join(__dirname, '../chat2/build', 'index.html'));
//         });

//         this.app.listen(this.serverPort);
//         console.log('Chatty:chat-server listening on port ' + this.serverPort);
//     }

//     setupSocketIOListener = (): any => {
//         // Socket.IO listens for events emitted by client-side JavaScript calls
//         this.io.on('connection', function(this: Server, socket) {
//             console.log('Socket IO connection established');

//             // user:login :: chat client sends username as a string from main login
//             socket.on('user:login', function (this: Server, username: string) {
//                 if (username != null && /\S/.test(username)) {
//                     console.log('Login request: ' + username);
//                     let loginMessage: string = 'User "' + username + '" has joined.';
//                     this.io.to(socket.id).emit('login:success', username);
//                     this.io.emit('message:received', loginMessage);
//                     this.messageHistory.push(loginMessage);
//                     console.log(username + ' logged in.');
//                 }  else {
//                     this.io.to(socket.id).emit('login:failure', 'invalid username');
//                 }
//             });

//             // message:send :: client sends message
//             socket.on('message:send', function (this: Server, message: string) {
//                 console.log(message);
//                 let messageObject = new Message(message);
//                 this.io.emit('message:received', messageObject.toString());
//                 this.messageHistory.push(messageObject.toString());
//             });

//             // user:disconnect :: client closes / about to close connection
//             socket.on('user:disconnect', function(this: Server, username: string) {
//                 let disconnectMessage: string = 'User ' + username + ' has disconnected';
//                 console.log(disconnectMessage);

//                 this.io.emit('message:received', disconnectMessage);
//                 this.messageHistory.push(disconnectMessage);
//             });

//             // retreive:history :: client login was succesful, retreive history
//             socket.on('retrieve:history', function(this: Server) {
//                 this.io.to(socket.id).emit('history:success', this.messageHistory);
//             })
//         });

//         this.server.listen(this.socketIoPort);
//         console.log('Chatty:SocketIO listening on port ' + this.socketIoPort);
//     }
// }

// const server = new Server();
// server.init();