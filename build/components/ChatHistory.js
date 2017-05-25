"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class ChatHistory extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("ul", { id: "messages" },
                this.props.messages.map(function (listValue) {
                    return React.createElement("li", null, listValue);
                }),
                ";")));
    }
}
exports.default = ChatHistory;
