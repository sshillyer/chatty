# Dockerized Redis Server (standalone)
Cite: https://docs.docker.com/engine/examples/running_redis_service/

## Build Docker image and run it
```
$ docker build -t sshillyer/redis .
$ docker run --name redis -d -p 6379:6379 sshillyer/redis
```