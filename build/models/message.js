"use strict";
// Encapsulate usernames with their messages
Object.defineProperty(exports, "__esModule", { value: true });
class Message {
    constructor(data) {
        let dataJSON = JSON.parse(data);
        this.username = dataJSON.username;
        this.message = dataJSON.message;
    }
    toString() {
        return this.username + ': ' + this.message;
    }
}
exports.default = Message;
