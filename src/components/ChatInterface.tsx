import * as React from "react";
import ChatHistory from "./ChatHistory";
import MessageEntry from "./MessageEntry";

interface ChatInterfaceProps {
    username: string;
    messages: string[];
}


class ChatInterface extends React.Component<ChatInterfaceProps, {}> {
    render() {
        return (
            <div>
                <ChatHistory messages={this.props.messages}/>
                <MessageEntry username={this.props.username}/>
            </div>
        );
    }
}

export default ChatInterface;
