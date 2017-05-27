# TODO list
# Phase 1: Refactor project
* Setup a handler in App that is passed as a prop to MessageEntry (through ChatInterface) that will send the username and message to the server
* Wire up the handler inside of MessageEntry to call the handler passed down just like in UserLogin
* Then modify ChatHistory with a similar handler that updates the App's state with additional messages as they come in
* Then migrate the old socketio server from the old project into the new project so can just run one build process and execute the server code and client code

## Phase 2: Docker
* Set up a docker container that spins up the node stuff for me
    CENTOS or Docker official node
* Wire up the messages to come from and get written to the Reddis database
* Write a docker to spin up the Reddis database

## Phase 3: Testing
* Unit testing and such with Mocha and Chai
* Code coverage >= 60% using Istanbul
* Sinon
* Caleb is looking up what will do this, but randomized testing (changes node code randomly to see if it can make things crash)

