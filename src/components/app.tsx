import * as React from 'react';
import ChatInterface from './components/ChatInterface';
import UserLogin from './components/UserLogin';
interface AppProps {

}

export default class App extends React.Component<AppProps, {}> {
  render() {

    return (
      <div>
        <ChatInterface username="bob" />
        <UserLogin username="bob"/>
      </div>
    );
  }
}