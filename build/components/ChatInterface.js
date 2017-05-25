"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ChatHistory_1 = require("./ChatHistory");
const MessageEntry_1 = require("./MessageEntry");
class ChatInterface extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(ChatHistory_1.default, { messages: this.props.messages }),
            React.createElement(MessageEntry_1.default, { username: this.props.username })));
    }
}
exports.default = ChatInterface;
