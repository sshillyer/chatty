"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
// TODO: Eliminate this Test code
const messages = ["First message", "second message", "Another message"];
const chatItems = messages.map((msg) => React.createElement("li", { key: msg }, msg));
class ChatHistory extends React.Component {
    render() {
        return (React.createElement("div", { className: "chatHistory" },
            React.createElement("ul", null, chatItems)));
    }
}
exports.default = ChatHistory;
