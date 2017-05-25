"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MessageEntry extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("label", { htmlFor: "messageInput" }, "Message"),
            React.createElement("input", { type: "text", name: "message", value: "", id: "messageInput" }),
            React.createElement("button", { onClick: () => alert('click') }, "Send"),
            React.createElement("form", { action: "", name: "message-form", id: "messageForm" },
                React.createElement("input", { id: "m" }),
                React.createElement("button", null, "Send"))));
    }
}
exports.default = MessageEntry;
