import * as React from 'react';
import UserLogin from './UserLogin';
import ChatInterface from './ChatInterface';
import * as io from 'socket.io-client';
import './App.css';

interface AppProps {
  // None
}

interface AppState {
  data: {};
  username: string;
  isLoggedIn: boolean;
  messageHistory: string[];
}

class App extends React.Component<AppProps, AppState> {
  private socket: SocketIOClient.Socket;

  constructor() {
    super();
    this.socket = io('http://localhost:8080');
    this.state = {data: {}, username: '', isLoggedIn: false, messageHistory: ['Empty'] };
    this.setState = this.setState.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleMessageSubmit = this.handleMessageSubmit.bind(this);
    this.handleMessageReceive = this.handleMessageReceive.bind(this);
    this.initializeChatHistory = this.initializeChatHistory.bind(this);
    this.handleLoginSuccess = this.handleLoginSuccess.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.onUnload = this.onUnload.bind(this);

  }

  componentDidMount(this: App) {
    window.addEventListener('beforeunload', this.onUnload);

    this.socket.on('message:received', this.handleMessageReceive);
    this.socket.on('history:success', this.initializeChatHistory);
    this.socket.on('login:success', this.handleLoginSuccess);
    this.socket.on('login:failure', this.handleLoginFailure);
  }

  // These are used to bind an event listener that emits a message upon disconnecting
  onUnload(this: App, e: any) {
      this.socket.emit('user:disconnect', this.state.username);
  }

  // Unbind the event listener (Future-proofing in case want to remove )
  componentWillUnmount(this: App) {
      window.removeEventListener('beforeunload', this.onUnload);
  }

  /*******************************
  Client-side listener helpers
  *******************************/
  handleMessageReceive(this: App, msg: string) {
    let messages: string[] = this.state.messageHistory.slice();
    messages.push(msg);
    this.setState({messageHistory: messages});
    return;
  }

  initializeChatHistory(this: App, messages: any) {
    this.setState({messageHistory: messages});
    return;
  }

  handleLoginSuccess(this: App, username: string) {
    this.setState({isLoggedIn: true, username: username});
    this.socket.emit('retrieve:history');
  }

  handleLoginFailure(this: App, msg: string) {
    // This prints if the server responds with the 'login:failure' event
    alert('Username invalid - must contain at least one non-whitespace character');
  }

  /*************************************************************
  Client-side Emitters (passed down to components as props)
  **************************************************************/
  handleLoginSubmit(e: any, username: string): void {
    e.preventDefault();
    // Note that the server validates the input as well as backup using same conditional
    if (username != null && /\S/.test(username)) {
      this.socket.emit('user:login', username);
    } else {
      alert('Username invalid - must contain at least one non-whitespace character');
    }
    e.value = '';
  }

  handleMessageSubmit(e: any, m: string, uname: string): void {
    e.preventDefault();
    let msgJSONstring: string = '{"username":"' + uname + '","message":"' + m + '"}';
    this.socket.emit('message:send', msgJSONstring);
    e.value = '';

  }
  
  render(this: App) {
    if (this.state.isLoggedIn) {
      return (
      <div className="App">
        <script src="/socket.io/socket.io.js" />
        <ChatInterface 
          username={this.state.username} 
          messages={this.state.messageHistory}
          handleMessageSubmit={this.handleMessageSubmit}
        />
      </div>
      );
    } else {
    return (
      <div className="App" >
        <script src="/socket.io/socket.io.js" />
        <UserLogin 
          handleLoginSubmit={this.handleLoginSubmit}
        />
      </div>
    );
    }
  }
}

export default App;
