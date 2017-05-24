import * as React from 'react';
import ChatInterface from './components/ChatInterface';

interface AppProps {

}

export default class App extends React.Component<AppProps, {}> {
  render() {

    return (
      <div>
        <ChatInterface username="bob" />
      </div>
    );
  }
}