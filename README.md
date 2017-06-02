# Chat server + React APP client
Chat server developed using Typescript, Express, and Socket IO. It serves the app contained in /chat2 and handles the socket io requests as well. This app has been dockerized to deploy as a separate server and client (in one Docker container) that works with a linked Redis docker container.

## Deploy using Docker
* This requires a machine with Docker installed and has no other dependencies.
* All commands are from root of the project.
* This is the preferred error-proof method of setting up the project.

1. Build and deploy the redis server container. From project root:
```
$ cd chatty-db
$ docker build -t sshillyer/redis .
$ docker run --name redis -d -p 6379:6379 sshillyer/redis
```

2. Build and deploy the server and client. From project root:
```
$ docker build -t sshillyer/chatty .
$ docker run -itd --name chatty -P -p 3001:3001 -p 8080:8080 --link redis:redis sshillyer/chatty
```

You should now be able to browse to the chat application at localhost 3001. Port 8080 is used for socket.io communication; port 3001 is the route used by express to serve up the static built react client. Port 6379 is the default Redis port.

### Setting up on a custom network
```
docker network create chattynet
docker run --name redis -d -p 6379:6379 --network=chattynet sshillyer/redis
docker run -itd --name chatty -p 3001:3001 --network=chattynet sshillyer/chatty
```



### Making a swarm
$ docker swarm init
$ docker stack deploy -c docker-compose.yml chatty



### Teardown
```
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```
Or manually kill processes:
$ docker kill redis
```
#### If a single server:
```
$ docker kill chatty
```

#### If a swarm:
```
$ docker stack rm chatty
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
Navigate to localhost:3001 (default) in a browser


## TODO:
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
