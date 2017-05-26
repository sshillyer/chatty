import * as React from "react";

interface UserLoginProps {
    // no props
}

class UserLogin extends React.Component<UserLoginProps, {}> {
    render() {
        return (
        <div>
            <h2>Web Chat Login</h2>

            <form action="" name="login-form" id="loginForm">
                <input id="user" /><button>Login</button>
            </form>
            
        </div>
        );
    }
}

export default UserLogin;
