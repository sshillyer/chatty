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
// let messageHistory: string[] = [];

// TODO: Encapsulate this into a server class that instantiates the server and listener

const serverPort: number = process.env.PORT || 3001;
const app: express.Application = express();
const server: http.Server = http.createServer(app);
const socketIOPort: number = process.env.PORT || 8080;
const io: SocketIO.Server = sio(server);
const dbClient: any = redis.createClient();

function setupChatServer(serverPort: number): number {
    // Set server to dish up the React App at root using static build folder
    app.use(express.static(path.join(__dirname, '../chat2/build')));
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../chat2/build', 'index.html'));
    });

    app.listen(serverPort).on('error', () => {
        return -1;
    });

    return serverPort;
}


function setupDatabase() {
    dbClient.on('error', (err: any) => console.log(err) );
    dbClient.on('ready', (msg: any) => console.log('Redis is ready') );
    dbClient.on('connect', () => console.log('Redis:connect'));
    dbClient.on('end', () => console.log('Redis client connection closed'));
};

function setupSocketIO(socketIOPort: number) {
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
}

setupChatServer(serverPort);
setupDatabase();
setupSocketIO(socketIOPort);


// SocketIO Handlers
function handleUserLogin(username: string, socketId: string): any {
    console.log('Login request: ' + username);
    if (username != null && /\S/.test(username)) {
        // Successful login - let new client know, add to db, and broadcast new message
        io.to(socketId).emit('login:success', username);
        let loginMessage: string = username + ' has joined the chat.';  
        io.emit('message:received', loginMessage);
        pushMessageToDatabase(loginMessage);
        console.log(username + ' logged in.');
        return('Login Success');
    }  else {
        // Failed - emit a failure and let client handle
        io.to(socketId).emit('login:failure', 'invalid username');
        throw new Error("Login Failed");
    }
}

function handleMessageRequest(message: string) {
    console.log(message);
    let messageObject = new Message(message);
    io.emit('message:received', messageObject.toString());
    pushMessageToDatabase(messageObject.toString());
}

function handleUserDisconnect(username: string) {
    let disconnectMessage: string = 'User ' + username + ' has disconnected';
    console.log(disconnectMessage);

    io.emit('message:received', disconnectMessage);
    // messageHistory.push(disconnectMessage); // old local storage
    pushMessageToDatabase(disconnectMessage);
    
}

function handleRetreiveHistory(socketId: string) {
    dbClient.lrange('messages', 0, -1, function(err: any, reply: any) {
        io.to(socketId).emit('history:success', reply);    
    });   
}

function pushMessageToDatabase(message: string) {
    dbClient.rpush(['messages', message], function(err: any, reply: any) {
        console.log(reply + ' messages pushed to database');
    });
}

export { setupChatServer, setupDatabase, setupSocketIO, handleUserLogin, handleMessageRequest, handleRetreiveHistory, handleUserDisconnect, pushMessageToDatabase };


// Cannot figure out why 'this' isn't binding in the functions (including just the socket.on(connection) section)

// class Server {
//     serverPort: number;
//     socketIoPort: number;
//     app: express.Application;
//     server: http.Server;
//     io: SocketIO.Server;
//     dbClient: any;

//     constructor() {
//         this.setupChatServer = this.setupChatServer.bind(this);
//         this.setupSocketIOListener = this.setupSocketIOListener.bind(this);
//         this.setupDatabase = this.setupDatabase.bind(this);
//     }

//     init(this: Server) {
//         this.setupChatServer();
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
//         this.setupSocketIOListener();
//         this.setupDatabase();
//     }

//     setupDatabase = () => {
//         this.dbClient = redis.createClient();

//         // Handlers for database client events
//         this.dbClient.on('error', (err: any) => console.log(err) );
//         // Examples, not used:
//         // dbClient.on('ready', (msg: any) => console.log('Redis is ready') );
//         // dbClient.on('connect', () => console.log('Redis:connect'));
//         // dbClient.on('end', () => console.log('Redis client connection closed'));
//     }

//     setupSocketIOListener = (): any => {
//         // Socket.IO listens for events emitted by client-side JavaScript calls
//         this.io.on('connection', function(this: Server, socket) {
//             console.log('Socket IO connection established');

//             // user:login :: chat client sends username as a string from main login
//             socket.on('user:login', function (this: Server, username: string) {
//                 handleUserLogin(this.io, this.dbClient, username, socket.id);
//             });

//             // message:send :: client sends message
//             socket.on('message:send', function (this: Server, message: string) {
//                 handleMessageRequest(this.io, this.dbClient, message);
//             });

//             // user:disconnect :: client closes / about to close connection
//             socket.on('user:disconnect', function(this: Server, username: string) {
//                 handleUserDisconnect(this.io, this.dbClient, username);
//             });

//             // retreive:history :: client login was succesful, retreive history
//             socket.on('retrieve:history', function(this: Server) {
//                 handleRetreiveHistory(this.io, this.dbClient, socket.id);
//             })
//         });

//         this.server.listen(this.socketIoPort);
//         console.log('Chatty:SocketIO listening on port ' + this.socketIoPort);
//     }
// }

// const server = new Server();
// server.init();


// // SocketIO Handlers
// function handleUserLogin(io: SocketIO.Server, dbClient: any, username: string, socketId: string){
//     console.log('Login request: ' + username);
//     if (username != null && /\S/.test(username)) {
//         // Successful login - let new client know, add to db, and broadcast new message
//         io.to(socketId).emit('login:success', username);
//         let loginMessage: string = username + ' has joined the chat.';  
//         io.emit('message:received', loginMessage);
//         // messageHistory.push(loginMessage); // old local storage
//         pushMessageToDatabase(dbClient, loginMessage);
//         console.log(username + ' logged in.');
//     }  else {
//         // Failed - emit a failure and let client handle
//         io.to(socketId).emit('login:failure', 'invalid username');
//     }
// }

// function handleMessageRequest(io: SocketIO.Server, dbClient: any, message: string) {
//     console.log(message);
//     let messageObject = new Message(message);

//     io.emit('message:received', messageObject.toString());

//     // messageHistory.push(messageObject.toString()); // old local storage
//     pushMessageToDatabase(dbClient, messageObject.toString());
// }

// function handleUserDisconnect(io: SocketIO.Server, dbClient: any, username: string) {
//     let disconnectMessage: string = 'User ' + username + ' has disconnected';
//     console.log(disconnectMessage);

//     io.emit('message:received', disconnectMessage);
//     // messageHistory.push(disconnectMessage); // old local storage
//     pushMessageToDatabase(dbClient, disconnectMessage);
    
// }

// function handleRetreiveHistory(io: SocketIO.Server, dbClient: any, socketId: string) {
//     dbClient.lrange('messages', 0, -1, function(err: any, reply: any) {
//         io.to(socketId).emit('history:success', reply);    
//     });   
// }

// function pushMessageToDatabase(dbClient: any, message: string) {
//     dbClient.rpush(['messages', message], function(err: any, reply: any) {
//         console.log(reply + ' messages pushed to database');
//     });
// }