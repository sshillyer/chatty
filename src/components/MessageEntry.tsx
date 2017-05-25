import * as React from "react";

interface MessageEntryProps {
    username: string;
}

class MessageEntry extends React.Component<MessageEntryProps, {}> {
    render() {
        return (
        <div>
            <form action="" name="message-form" id="messageForm">
                <input id="m" /><button>Send</button>
                <input id="uname" type="hidden" value={this.props.username}/>
            </form>
        </div>
        );
    }
}

export default MessageEntry;
