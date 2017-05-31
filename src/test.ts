import * as express from 'express';
import * as path from 'path';
import * as sio from 'socket.io';
import * as http from 'http';
import * as redis from 'redis';

import { setupChatServer, setupDatabase, setupSocketIO, handleUserLogin, handleMessageRequest, handleRetreiveHistory, handleUserDisconnect, pushMessageToDatabase } from './server';
import { expect } from 'chai';

describe('Server functions', () => {
    // Setup
    // const serverPort: number = process.env.PORT || 3002;
    // const app: express.Application = express();
    // const server: http.Server = http.createServer(app);
    // const socketIOPort: number = process.env.PORT || 8080;
    // const io: SocketIO.Server = sio(server);
    // const dbClient: any = redis.createClient();
    
    setupChatServer();
    setupDatabase();
    setupSocketIO();

    it('should return Login Fail', () => {
        const result = handleUserLogin('', '0');
        expect(result).to.equal('Login Fail');
    });

    it('should return Login Success', () => {
        const result = handleUserLogin('A', 'derper');
        expect(result).to.equal('Login Success');
    });

    // it('should return Login Success', () => {
    //     const result = handleUserLogin('A', soc)
    // })


    // Teardown
    // server
});