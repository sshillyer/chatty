"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class MessageEntry extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("form", { action: "", name: "message-form", id: "messageForm" },
                React.createElement("input", { id: "m" }),
                React.createElement("button", null, "Send"),
                React.createElement("input", { id: "uname", type: "hidden", value: this.props.username }))));
    }
}
exports.default = MessageEntry;
