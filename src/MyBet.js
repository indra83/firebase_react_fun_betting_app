import React from 'react';
import { db } from './firebase';

import Spinner from 'react-bootstrap/Spinner';

class MyBet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {match:null};
  }

  componentDidMount() {
    this.unsubscribe = db.collection("matches").doc("testmatch")
    .onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        console.log("Doc:",doc);
        this.setState({match: doc.data(), matchId: doc.id});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return <span >Betting has ended.</span>;
        } else {
            // Render a countdown
            return <span>Betting ends in {hours}:{minutes}:{seconds}</span>;
        }
    }

  render() {
    return (this.state.match 
        ? 
        (<div><h3>{this.state.match.title}</h3>
           <Countdown date={this.state.match.startTime.toDate()} render={this.renderer}/>
           <MatchBets matchId={this.state.matchId} match ={this.state.match} {...this.props}/>
            </div>)
        : 
        (<span><Spinner animation="border" />Fetching match details...</span>))
  }
}

export default MyBet;