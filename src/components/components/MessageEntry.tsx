import * as React from "react";

interface MessageEntryProps {
    username: string;
    message: string;
}

class MessageEntry extends React.Component<MessageEntryProps, {}> {
    render() {
        return (
        <div>
            
                <label htmlFor="messageInput">Message</label>
                <input type="text" name="message" value="" id="messageInput"/>
                <button onClick={() => alert('click')}>Send</button>

            <form action="" name="message-form" id="messageForm">
                <input id="m" /><button>Send</button>
            </form>
        </div>
        );
    }

    
}

export default MessageEntry;
