import * as React from "react";
import ChatHistory from "./ChatHistory";
import MessageEntry from "./MessageEntry";

interface ChatInterfaceProps {
    username: string;
    // chathistory: string[];
}


class ChatInterface extends React.Component<ChatInterfaceProps, {}> {
    render() {
        return (
            <div>
                <ChatHistory />
                <MessageEntry username={this.props.username} message=""/>
            </div>
        );
    }

    handleSend() {
        // Not sure how to get the onclick handler working with TypeScript; tutorial makes it look easy.
        alert("Clicked!");
    }
}

export default ChatInterface;
