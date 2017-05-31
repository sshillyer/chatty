import * as express from 'express';
import * as path from 'path';
import * as sio from 'socket.io';
import * as http from 'http';
import * as redis from 'redis';

import { setupChatServer, setupDatabase, setupSocketIO, handleUserLogin, handleMessageRequest, handleRetreiveHistory, handleUserDisconnect, pushMessageToDatabase } from './server';
import { expect, assert } from 'chai';
// import * as sinon from 'sinon';

describe('handleUserLogin', () => {
    // Setup
    const serverPort: number = 3002;
    const app: express.Application = express();
    const server: http.Server = http.createServer(app);
    const socketIOPort: number = process.env.PORT || 8080;
    const io: SocketIO.Server = sio(server);
    const dbClient: any = redis.createClient();
    
    setupChatServer(serverPort);
    setupDatabase();
    setupSocketIO(socketIOPort);

    it('should return throw an Error', () => {
        expect(function() {
            handleUserLogin('', '0');
        }).to.throw(Error);
    });

    it('should return Login Success', () => {
        const result = handleUserLogin('A', 'derper');
        expect(result).to.equal('Login Success');
    });

    it('should return Login Success', () => {
        const result = handleUserLogin(' A ', '');
    });


});


describe('setupChatServer', () => {
    const serverPort: number = 3002;
    const app: express.Application = express();
    const app2: express.Application = express();
    const server: http.Server = http.createServer(app);
    const server2: http.Server = http.createServer(app2);
    const socketIOPort: number = process.env.PORT || 8080;
    const io: SocketIO.Server = sio(server);
    const dbClient: any = redis.createClient();
    
    it('should return non-negative port number', () => {
        const result = setupChatServer(serverPort);
        expect(result).to.equal(serverPort);
    });

    // Can't figure out how to write  failing test here
    // it('should return a negative number', () => {
    //     setupChatServer(serverPort);
    //     const result = setupChatServer(serverPort);
    //     expect(result).to.equal(-1);
    // });
});


describe('handleMessageRequest', () => {
    // Setup
    const serverPort: number = 3002;
    const app: express.Application = express();
    const server: http.Server = http.createServer(app);
    const socketIOPort: number = process.env.PORT || 8080;
    const io: SocketIO.Server = sio(server);
    const dbClient: any = redis.createClient();

    // Problem here, probably need to use promises but built in mocha/chai stuff doesn't work
    it('should increase size of database messages by 1', () => {
        const messages = 'messages';
        const sizeBefore = dbClient.llen(messages);

        handleMessageRequest('{"username":"bob","message":"unit testing"}');
        const sizeAfter = dbClient.llen('messages');
        // expect(sizeBefore).to.equal(sizeAfter - 1);
        assert.strictEqual(sizeBefore+1, sizeAfter);
 
        

    });

});
