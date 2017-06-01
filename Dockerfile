# Use latest LTS version of node
FROM node:boron

# Make directory to save our app in (working directory)
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy chat-server src files to container
COPY . /usr/src/app
# COPY *.json /usr/src/app/
# COPY src/* /usr/src/app/
# COPY src/models

# Copy chat2 React app files to container
# COPY chat2/*.json /usr/src/app/chat2/
# COPY chat2/src/* /usr/src/app/chat2/src/

# Install Global modules for compiling TS and keeping node running
RUN npm install typescript -g
RUN npm install nodemon -g

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
CMD ["nodemon", "build/server.js"]
