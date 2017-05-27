import * as React from 'react';

interface MessageEntryProps {
    username: string;
    handleMessageSubmit: (e: any, m: string, uname: string) => void;
}

interface MessageEntryState {
    value: string;
}

class MessageEntry extends React.Component<MessageEntryProps, MessageEntryState> {
    constructor(props: any) {
        super(props);
        this.state = { value: ''};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: any): void {
        this.setState({value: event.target.value});
    }

    render() {
        return (
        <div>
            <form 
                id="messageForm"
                name="message-form"
                onSubmit={e => {
                    this.props.handleMessageSubmit(e, this.state.value, this.props.username);
                    this.setState({value: ''});
                    }
                }

            >
                <input 
                    id="m"
                    type="text"
                    value={this.state.value}
                    onChange = {e => this.handleChange(e)}
                />
                <button>Send</button>
                
                <input id="uname" type="hidden" value={this.props.username}/>
            </form>
        </div>
        );
    }
}

export default MessageEntry;
