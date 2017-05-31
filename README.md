# Chat server + React APP client
Chat server developed using Typescript, Express, and Socket IO. It serves the app contained in /chat2 and handles the socket io requests as well.

### Install all dependencies:
```
$ npm install
$ cd chat2
$ npm install
```
### Ensure Typescript is installed:
```
$ npm install typescript -g
```
### Build server:
```
$ tsc  # From root
```
### Launch server:
```
$ node build/server.js
```

### Build React client:
```
$ cd chat2 # From root
$ npm run build
```

### Install Redis
```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```

### Start Redis server
```
$ src/redis-server  # from the redis folder (e.g. root/redis-3.2.9)
```
###

### Launch client
Navigate to localhost:3001 (default) or whatever port 'Chatty:chat-server' says it is listening on.
If for some reason the port for SocketIO is not 8080, the chat2 React client would need to be updated?? (Not sure if this is true, double check)

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
    * Idea: Make the redis DB primary option but allow it to run using the node server's memory store if the db cannot connect for some reason??
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


### REDI notes
RPUSH messages "messagestring"  // push value to right side of list
LRANGE messages 0 -1     // Gets all the messages in the list
LLEN messages  => number of elements in list
LPOP / RPOP  => remove from left (front) or right (back) of list
This is helpful:    https://www.sitepoint.com/using-redis-node-js/
Official docs:      https://redis.io/documentation

#### Installing / Using with node
npm install redis  // --save?

#### Installing Redis itself
Only available on *Nix
Guides to setting it up on VBox: 
* http://resources.infosecinstitute.com/installing-configuring-centos-7-virtualbox/#gref
* https://wiki.centos.org/HowTos/Virtualization/VirtualBox


##### "client" side logic (this would be put into the base chatty app in root dir to send/retreive data)


```javascript
// Need to convert this to typescript...
var redis = require('redis')
var client = redis.createClient(); // creates a new client

// Redis uses 127.0.0.1 and 6379 as the hostname:port respectively. They can be provided as params
var client = redis.createCient(port, host);

// Listen for a connection made and then execute the c/b function
client.on('connect', function() {
    console.log('connected');
});

// This does not RUN the Redis server, it just attempts to connect

// Storing a value:
client.set('key', 'value');
client.set(['key', 'value']);

// optional callback:
client.set('message', 'hey there', function(err, reply) {
    console.log(reply);
});

client.get('message', fucntion(err, reply) {
    console.log(reply);
});

// Hashmap sets:
client.hmset('frameworks', 'javascript', 'AngularJS', 'css', 'Bootstrap', 'node', 'Express');

client.hgetall('frameworks', function(err, object) {
    console.log(object);
});

// alt syntax
client.hmset('frameworks', {
    'javascript': 'AngularJS',
    'css': 'Bootstrap',
    'node': 'Express'
});

// Storing a list:

client.rpush(['messages', 'hello', 'welcome to the party'], function(err, reply) {
    console.log(reply); // prints '2'
});

// the first arg is the 'key' for the list and the rest are the elements. The return value is the number of elements inside the key
client.lrange('messages', 0, -1, function(err, reply) {
    console.log(reply); // retreives the entire list...!
});

// sets -- duplicates not allowed
client.sadd(['tags', 'angularjs', 'backbonejs', 'emberjs'], function(err, reply) {
    console.log(reply); // 3
});
client.smembers('tags', function(err, reply) {
    console.log(reply);
});

// Check if exists:
client.exists('key', function(err, reply) {
    if (reply === 1) {
        console.log('exists');
    } else {
        console.log('doesn\'t exist');
    }
});

// Delete and expire
client.del('keyname', function(err, reply) {
    console.log(reply);
});


client.set('key1', 'val1');
client.expire('key1', 30);  // expire key1 in 30 seconds

// Incrementing

client.set('key1', 10, function() {
    client.incr('key1', function(err, reply) {
        console.log(reply); // 11
    });
});


```
