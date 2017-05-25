import * as React from "react";

interface ChatHistoryProps {
    messages: string[];
}


class ChatHistory extends React.Component<ChatHistoryProps, {}> {
    render() {
        return (
        <div>
            <ul id="messages">
                {this.props.messages.map(function(listValue){
                    return <li>{listValue}</li>;
                })};
            </ul>

        </div>
        );
    }
}

export default ChatHistory;
