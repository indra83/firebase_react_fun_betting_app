import React from 'react';
import YouTube from 'react-youtube';
import { auth } from './firebase';
import Match from './Match';
import './App.css';
import SignIn from './SignIn';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true
    };

    this.opts = {
      height: '390',
      width: '640',
      playerVars: {
       autoplay: 0,
      },
    }
  }

  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user);
        this.setState({
          authenticated: true,
          loading: false,
          user:user
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false
        });
      }
    });
  }

  render(){ return (
    <div className="App">
      <YouTube videoId="nNQMVC_njf0" opts={this.opts} />
      {this.state.authenticated ? (<Match user={this.state.user}/>) : (<SignIn/>)}
    </div>)
  }
}

export default App;
