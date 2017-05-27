import * as React from 'react';
import ChatHistory from './ChatHistory';
import MessageEntry from './MessageEntry';

interface ChatInterfaceProps {
    username: string;
    messages: string[];
    handleMessageSubmit: (e: any, m: string, uname: string) => void;
}

class ChatInterface extends React.Component<ChatInterfaceProps, {}> {
    render() {
        return (
            <div>
                <ChatHistory messages={this.props.messages}/>
                <MessageEntry 
                    username={this.props.username} 
                    handleMessageSubmit={this.props.handleMessageSubmit}
                />
            </div>
        );
    }
}

export default ChatInterface;
