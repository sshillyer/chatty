# Chat server + React APP client
Chat server developed using Typescript, Express, and Socket IO. It serves the app contained in /chat2 and handles the socket io requests as well.

## To install all dependencies
$ npm install
$ cd chat2
$ npm install

## To build the server:
$ cd chat2
$ npm run build
$ cd ..
$ tsc
$ node build/server.js

## TODO:
These tasks need to be completed. This is in rough priority order:

* Implement the following testing components:
    * Mocha
    * Chai
    * Instanbul (Code coverage goal 60%)
    * Sinon
    * & and additional tool that randomizese the node to see if it breaks anything
* Implement a backend to save the message history
    * Redis
* Docker
    * Implement a docker container that deploys the server + client
    * Implement a docker container that deploys the Redis server

Not essential for the project specifications, these items can be done if time permits:
* Cleanup:
    * Auto-scroll to bottom of the view to see most recently history (Newest messages are displayed at end of list and drop out of view until scrolled to)
    * Unique usernames only, time stamps, etc.

# Development Workflow
For the REACT app, cd into chat2/ and type 'npm start' to deploy the app in development mode.
You also need the server to be running. From root, run 'tsc --watch' in at one command line and 'nodemon bulid/server.js' in another.
    (The first rebuilds on save, the second relaunches the server on file changes)


### NOTES
Need to verify with a fresh git pull that all dependencies are installed properly via above instructions.
