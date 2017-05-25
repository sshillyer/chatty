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
                <input id="user" /><button>Login</button>
            </form>
        </div>
        );
    }
}

export default UserLogin;


            /*<form>
                <input type="text" name="username" defaultValue={this.props.username} />
                <input type="submit" value="Log On"/>
            </form>*/
            