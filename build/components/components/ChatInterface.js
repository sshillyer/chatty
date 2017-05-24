"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ChatHistory_1 = require("./ChatHistory");
const MessageEntry_1 = require("./MessageEntry");
class ChatInterface extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(ChatHistory_1.default, null),
            React.createElement(MessageEntry_1.default, { username: this.props.username, message: "" })));
    }
    handleSend() {
        // Not sure how to get the onclick handler working with TypeScript; tutorial makes it look easy.
        alert("Clicked!");
    }
}
exports.default = ChatInterface;
