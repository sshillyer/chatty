"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MessageEntry extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("label", { htmlFor: "messageInput" }, "Message"),
            React.createElement("input", { type: "text", name: "message", value: "", id: "messageInput" }),
            React.createElement("button", { onClick: () => alert('click') }, "Send")));
    }
}
exports.default = MessageEntry;
