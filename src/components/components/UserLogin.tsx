import * as React from "react";

interface UserLoginProps {
    username: string;
}

class UserLogin extends React.Component<UserLoginProps, {}> {
    render() {
        return (
        <div>
            <h2>Web Chat Login</h2>

            <form action="" name="login-form" id="loginForm">
                <input id="user" /><button onClick={this.yell}>Login</button>
            </form>
            
        </div>
        );
    }
    
    yell() {
        alert("AHHH");
    }
}

export default UserLogin;
