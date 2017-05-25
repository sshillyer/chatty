import * as React from "react";

interface ChatHistoryProps {
    // messages: string[];
}


class ChatHistory extends React.Component<ChatHistoryProps, {}> {
    render() {
        return (
        <div>
            <ul id="messages"></ul>
        </div>
        );
    }
}

export default ChatHistory;
