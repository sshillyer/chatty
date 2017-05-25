import * as React from "react";

interface ChatHistoryProps {
    // messages: string[];
}

// TODO: Eliminate this Test code
// const messages = ["First message", "second message", "Another message"];
// const chatItems = messages.map((msg) =>
//     <li key={msg}>{msg}</li>
// );

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
