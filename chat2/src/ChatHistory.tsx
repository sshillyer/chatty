import * as React from 'react';

interface ChatHistoryProps {
    messages: string[];
}

class ChatHistory extends React.Component<ChatHistoryProps, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
        <div id="history-div">
            <ul id="messages">
                {this.props.messages.map(function(messageValue: string){
                    return <li>{messageValue}</li>;
                })};
            </ul>
        </div>

        );
    }
}

export default ChatHistory;
