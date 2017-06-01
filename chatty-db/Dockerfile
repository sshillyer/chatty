FROM        ubuntu:14.04
RUN         apt-get update && apt-get install -y redis-server
EXPOSE      6379
EXPOSE      8080
ENTRYPOINT  ["/usr/bin/redis-server"]