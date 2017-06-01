# Chat server + React APP client
Chat server developed using Typescript, Express, and Socket IO. It serves the app contained in /chat2 and handles the socket io requests as well.

## Easy Deployment using Docker
```
$ docker network create chatnet
$ docker build -t sshillyer/chatty-app .
Build and deploy the redis server container
$ docker run -itd --network=chatnet --name chatty -p 3001:3001 -p 8080:8080 sshillyer/chatty

 // DON"T THINK THIS WORKS: // docker run -d --name chatty -p 3001:3001  --link redis:redis sshillyer/chatty
```

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

* Implement the following testing components: [[ Partially completed ]]
    * Mocha [X]
    * Chai [X]
    * Instanbul (Code coverage goal 60%)
    * Sinon
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

1. Set up the Dockerfile
2. Set up a docker-compose.yml
3. docker swarm init
4. docker stack deploy -c docker-compose.yml nameofapp
5. You can see all containers: docker stack ps nameofapp
6. docker stack rm nameofapp  # kills the stack

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
