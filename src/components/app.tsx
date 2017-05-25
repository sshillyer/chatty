import * as React from 'react';
import ChatInterface from './ChatInterface';
import UserLogin from './UserLogin';
interface AppProps {

}

export default class App extends React.Component<AppProps, {}> {
  render() {

    return (
      <div>
        <UserLogin />
      </div>
    );
  }
}