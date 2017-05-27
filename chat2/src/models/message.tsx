// Encapsulate usernames with their messages

export default class Message {
    username: string;
    message: string;

    constructor(data: string) {
        let dataJSON = JSON.parse(data);
        this.username = dataJSON.username;
        this.message = dataJSON.message;
    }

    toString() {
        return this.username + ': ' + this.message;
    }
}
