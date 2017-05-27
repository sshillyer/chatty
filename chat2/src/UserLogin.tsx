import * as React from 'react';

interface UserLoginProps {
    handleLoginSubmit: (e: any, v: string) => void;
}

interface UserLoginState {
    value: string;
}

class UserLogin extends React.Component<UserLoginProps, UserLoginState> {
    constructor() {
        super();
        this.state = { value: ''};

        this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: any): void {
        this.setState({value: event.target.value});
    }

    render() {
        return (
        <div className="userlogin">
            <h2>Web Chat Login</h2>
            <form 
                name="login-form"
                id="loginForm" 
                onSubmit={e => this.props.handleLoginSubmit(e, this.state.value)}
            >
                <input 
                    id="user" 
                    type="text" 
                    value={this.state.value} 
                    onChange = {e => this.handleChange(e)}
                />
                <button>Login</button>
            </form>
        </div>
        );
    }
}

export default UserLogin;
