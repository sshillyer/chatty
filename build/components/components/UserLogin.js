"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class UserLogin extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("h2", null, "Web Chat Login"),
            React.createElement("form", null,
                React.createElement("input", { type: "text", name: "username", defaultValue: this.props.username }),
                React.createElement("input", { type: "submit", value: "Log On" }))));
    }
}
exports.default = UserLogin;
