// Some doc's referenced
// CITE: https://socket.io/get-started/chat/ 

import * as express from 'express';
import * as path from 'path';
import * as sio from 'socket.io';
import * as http from 'http';
import * as redis from 'redis';
// import * as os from 'os';
import * as sioRedis from 'socket.io-redis';

// Data model(s)
import Message from './models/Message';

const serverPort: number = process.env.PORT || 3000;
const app: express.Application = express();
const server: http.Server = http.createServer(app);
// const socketIOPort: number = process.env.PORT || 8080;
const socketIOPort: number = serverPort;
const io: SocketIO.Server = sio(server);


// Assumes using docker with config file provided. Confirmed working unless deploying multiple severs
const redisHost  = 'redis'; // 'localhost'  if serving locally
const redisPort  = 6379;
const dbClient: any = redis.createClient(redisPort, redisHost);

// Setup socket.io to use multi-server socket.io-redis
io.adapter(sioRedis({ host: redisHost, port: 6379 }));
// io.use((err: any) => console.log(err));




function setupChatServer(serverPort: number): number {
    // Set server to dish up the React App at root using static build folder
    app.use(express.static(path.join(__dirname, '../chat2/build')));

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '../chat2/build', 'index.html'));
    });

    server.listen(serverPort, "0.0.0.0").on('error', (err: Error) => {
        console.log(err);
    });

    return serverPort;
}

function setupDatabase() {
    // Listeners for database events
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
