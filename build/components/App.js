"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ChatInterface_1 = require("./components/ChatInterface");
const UserLogin_1 = require("./components/UserLogin");
class App extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement(ChatInterface_1.default, { username: "bob" }),
            React.createElement(UserLogin_1.default, { username: "bob" })));
    }
}
exports.default = App;
