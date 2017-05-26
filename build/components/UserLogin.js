"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class UserLogin extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("h2", null, "Web Chat Login"),
            React.createElement("form", { action: "", name: "login-form", id: "loginForm" },
                React.createElement("input", { id: "user" }),
                React.createElement("button", null, "Login"))));
    }
}
exports.default = UserLogin;
