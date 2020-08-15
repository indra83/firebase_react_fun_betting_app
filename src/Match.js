import React from 'react';
import { db } from './firebase';

import Spinner from 'react-bootstrap/Spinner';
import Countdown from 'react-countdown';

import MatchBets from './MatchBets';

class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {match:null};
  }

  componentDidMount() {
    this.unsubscribe = db.collection("matches").doc("testmatch")
    .onSnapshot((doc) => {
        console.log("Match::Current data: ", doc.data());
        console.log("Match::Doc:",doc);
        this.setState({match: doc.data(), matchId: doc.id});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
        var timeLeftStr = hours.toString()+':'+minutes.toString()+':'+seconds.toString();
        if (completed) {
            // Render a completed state
            return <span >Betting has ended.</span>;
        } else {
            // Render a countdown
            return <div><span>Betting ends in <b>{timeLeftStr}</b></span></div>;
        }
    }

  render() {
    return (this.state.match 
        ? 
        (<div><h3>{this.state.match.title}</h3>
           <Countdown date={this.state.match.startTime.toDate()} renderer={this.renderer}/>
           <MatchBets matchId={this.state.matchId} match ={this.state.match} user={this.props.user}/>
            </div>)
        : 
        (<span><Spinner animation="border" />Fetching match details...</span>))
  }
}

export default Match;