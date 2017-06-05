# About Chatty
Chat server developed using Node.js TypeScript, Express, React, and Socket IO. It serves the app contained in /chat2 and handles the socket io requests as well. This app has been dockerized to deploy as a separate server and client (each in their own Docker container but deployed on a docker network).

* Runtime environment and platform
* Typescript: enforces typing; layer on top of Node.js
* Express: Simple routing module for Node
* React: Web-app framework developed by Facebook. Presents user interface and maintains state during execution. Allows development of small components and composition of these components into an interface.
* Socket.io: Networking between client and server is established using sockets. Signals are sent back and forth to signal events.
* Socket.io-redis: Creates a bridge between all connected clients, rebroadcasting messages from isolated clients to any other connected clients.
* Redis: In addition to being used by Socket.io to handle distribution of messages to connected clients (see above), all message history and connection events are logged to the Redis database.
* Testing Framework: Mocha, Chai, Sinon and Istanbul were used to partially test the code. Project was not written in a TDD style so testing is partial and far from complete, but could be expanded on later.

## Usage
This application can most easily be deployed using Docker in a development environment.

* Requirements: Device with Docker installed. This was built using Docker version 17.03.1-ce
* All commands are from project root unless prefaced by a cd command

1. Build Docker images for chat server and Redis. From project root:
```
$ docker build -t sshillyer/chatty .
$ cd chatty-db
$ docker build -t sshillyer/redis .
```

2. Set up a docker network for the app to enable hostname lookups and open ports
```
docker network create chattynet
```

3. Run the images on that network (Redis must launch first)
```
docker run --name redis -d -p 6379:6379 --network=chattynet sshillyer/redis
docker run -itd --name chatty1 -p 3001:3001 -e PORT="3001" --network=chattynet sshillyer/chatty
docker run -itd --name chatty2 -p 3002:3002 -e PORT="3002" --network=chattynet sshillyer/chatty
docker run -itd --name chatty3 -p 3003:3003 -e PORT="3003" --network=chattynet sshillyer/chatty
docker run -itd --name chatty4 -p 3004:3004 -e PORT="3004" --network=chattynet sshillyer/chatty

```

### Teardown
```
docker kill $(docker ps -a -q)
docker rm $(docker ps -a -q)
```






## Deprecated Instructions and Notes for Self
### Making a swarm
```
$ docker swarm init
$ docker stack deploy -c docker-compose.yml chatty
```

### Swarm across machines
```
docker-machine ssh vm1 "docker swarm init --advertise-addr 147.34.54.160:2377"

docker-machine ssh vm2 "docker swarm join \
--token SWMTKN-1-5tl3pmpga0xkylwyso8gcoa96kz0jee47aeov5wov8bw5frhiu-dbuxyxxq92za0jvunlkc8i9tl \
147.34.54.160:2377"

docker-machine ssh vm1 "mkdir ./data"

docker-machine scp docker-compose.yml vm1:~

docker-machine ssh vm1 "docker stack deploy -c docker-compose.yml chatty"
```

#### Check the stack is deployed
```
docker-machine ssh vm1 "docker stack ps chatty"
```

## Manual Installation without Docker

### Install all dependencies:
From parent directory:
```
$ git clone https://github.com/sshillyer/chatty
$ cd chatty
$ npm install
$ cd chat2
$ npm install
```
### Ensure Typescript and Nodemon are installed:
```
$ npm install typescript -g
$ npm install nodemon -g
```
### Build server:
```
$ tsc  # From root
```
### Launch chat-server that hosts client and manages connections:
```
$ nodemon build/server.js
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

### Launch client
Navigate to localhost:3000 (default) in a browser


## Testing:
These tasks need to be completed. This is in rough priority order:

* Implement additional tests using the following libraries:
    * Mocha [X] 
    * Chai [X]
    * Instanbul (Code coverage goal 60%)
    * Sinon

* Cleanup:
    * Auto-scroll to bottom of the view to see most recently history (Newest messages are displayed at end of list and drop out of view until scrolled to)
    * Unique usernames only, time stamps, etc.

# Development Workflow
For the REACT app, cd into chat2/ and type 'npm start' to deploy the app in development mode.
You also need the server to be running. From root, run 'tsc --watch' in at one command line and 'nodemon bulid/server.js' in another.
    (The first rebuilds on save, the second relaunches the server on file changes)

From there, any changes to chat2 or server source code will be recompiled and refresh automatically

## Docker Cheat Sheet
```
docker build -t friendlyname .  # Create image using this directory's Dockerfile
docker run -p 4000:80 friendlyname  # Run "friendlyname" mapping port 4000 to 80
docker run -d -p 4000:80 friendlyname         # Same thing, but in detached mode
docker ps                                 # See a list of all running containers
docker stop <hash>                     # Gracefully stop the specified container
docker ps -a           # See a list of all containers, even the ones not running
docker kill <hash>                   # Force shutdown of the specified container
docker rm <hash>              # Remove the specified container from this machine
docker rm $(docker ps -a -q)           # Remove all containers from this machine
docker images -a                               # Show all images on this machine
docker rmi <imagename>            # Remove the specified image from this machine
docker rmi $(docker images -q)             # Remove all images from this machine
docker login             # Log in this CLI session using your Docker credentials
docker tag <image> username/repository:tag  # Tag <image> for upload to registry
docker push username/repository:tag            # Upload tagged image to registry
docker run username/repository:tag                   # Run image from a registry
docker stack ls              # List all running applications on this Docker host
docker stack deploy -c <composefile> <appname>  # Run the specified Compose file
docker stack services <appname>       # List the services associated with an app
docker stack ps <appname>   # List the running containers associated with an app
docker stack rm <appname>                             # Tear down an application
docker-machine create --driver virtualbox myvm1 # Create a VM (Mac, Win7, Linux)
docker-machine create -d hyperv --hyperv-virtual-switch "myswitch" myvm1 # Win10
docker-machine env myvm1                # View basic information about your node
docker-machine ssh myvm1 "docker node ls"         # List the nodes in your swarm
docker-machine ssh myvm1 "docker node inspect <node ID>"        # Inspect a node
docker-machine ssh myvm1 "docker swarm join-token -q worker"   # View join token
docker-machine ssh myvm1   # Open an SSH session with the VM; type "exit" to end
docker-machine ssh myvm2 "docker swarm leave"  # Make the worker leave the swarm
docker-machine ssh myvm1 "docker swarm leave -f" # Make master leave, kill swarm
docker-machine start myvm1            # Start a VM that is currently not running
docker-machine stop $(docker-machine ls -q)               # Stop all running VMs
docker-machine rm $(docker-machine ls -q) # Delete all VMs and their disk images
docker-machine scp docker-compose.yml myvm1:~     # Copy file to node's home dir
docker-machine ssh myvm1 "docker stack deploy -c <file> <app>"   # Deploy an app
```

### Docker workflow:
1. Set up the Dockerfile
2. Set up a docker-compose.yml
3. docker swarm init
4. docker stack deploy -c docker-compose.yml nameofapp
5. You can see all containers: docker stack ps nameofapp
6. docker stack rm nameofapp  # kills the stack


## Redis notes
RPUSH messages "messagestring"  // push value to right side of list
LRANGE messages 0 -1     // Gets all the messages in the list
LLEN messages  => number of elements in list
LPOP / RPOP  => remove from left (front) or right (back) of list
This is helpful:    https://www.sitepoint.com/using-redis-node-js/
Official docs:      https://redis.io/documentation

### Installing Node module and @types
npm install redis --save
npm install @types/redis

### Installing Redis itself
Only available on Unix systems
Guides to setting it up on VBox: 
* http://resources.infosecinstitute.com/installing-configuring-centos-7-virtualbox/#gref
* https://wiki.centos.org/HowTos/Virtualization/VirtualBox

Easier option: Deploy official Docker redis container with default ports exposed and enjoy!

#### Node.JS Server/Client logic
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
