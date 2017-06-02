# Use latest LTS version of node
FROM node:boron

# Make directory to save our app in (working directory)
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy chat-server src files to container
COPY . /usr/src/app

# Install Global modules for compiling TS and keeping node running
RUN npm install typescript -g
RUN npm install forever -g

# Install chat-server's dependencies per package.json
RUN npm install

# Build server and react client
RUN tsc
WORKDIR chat2
RUN npm install
RUN npm run build

# Expose app's' port to map it to docker daemon
EXPOSE 3001
EXPOSE 8080

# Launch chat-server
WORKDIR /usr/src/app
CMD ["forever", "build/server.js"]
