"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
// TODO: Eliminate this Test code
// const messages = ["First message", "second message", "Another message"];
// const chatItems = messages.map((msg) =>
//     <li key={msg}>{msg}</li>
// );
class ChatHistory extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("ul", { id: "messages" })));
    }
}
exports.default = ChatHistory;
