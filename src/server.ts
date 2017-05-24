import * as express from 'express';

const serverPort: number = process.env.PORT || 3000;

const app: express.Application = express();

app.listen(serverPort, () => {
    console.log('Listening at http://localhost:' + serverPort + '/'); // TODO: The replacement isn't happening here
});
