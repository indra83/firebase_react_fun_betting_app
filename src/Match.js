import React from 'react';
import { db } from './firebase';

import Spinner from 'react-bootstrap/Spinner';
import Countdown from 'react-countdown';
import YouTube from 'react-youtube';

import MatchBets from './MatchBets';
import { Alert, Button, Container, Row, Col, ResponsiveEmbed } from 'react-bootstrap';
import MyBet from './MyBet';

class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMatchData:false,
      match:null,
      hasBetsData:false,
      bets:null,
      myBet:null,
      videoId:'nNQMVC_njf0'
    }
    this.opts = {
      height: 'auto',
      width: 'auto',
      playerVars: {
       autoplay: 1,
      },
    }
  }

  setupBetsListener = () => {
    this.unsubscribe_bets = db.collection("matches").doc(this.state.match.matchId).collection("bets")
    .onSnapshot((querySnapshot) => {
        if(querySnapshot.metadata.hasPendingWrites)
          return; // ignore
        console.log("Match::querySnapshot--", querySnapshot);
        var myBet;
        var bets = {'team1':[], 'team2':[]} 

        querySnapshot.forEach((doc) => {
          var bet = doc.data();
          if(doc.id===this.props.user.uid) myBet = bet;
          bets[bet.team].push(bet);
        });
        console.log("MatchBets::Current data: ", bets);
        this.setState({
            hasBetsData: true, 
            bets:bets, 
            myBet:myBet
        });
    });
  }

  componentDidMount() {
    this.unsubscribe_match = db.collection("matches").orderBy("order", "desc").limit(1)//.doc("testmatch")
    .onSnapshot((docs) => {
      console.log("match::match_query--",docs);
        if(docs.metadata.fromCache) {
          return; // ignore cached results
        }
        var doc = docs.docs[0];
        var match = doc.data();
        match.matchId = doc.id;
        console.log("Match::got data--",match);
        this.setState({hasMatchData:true, match: match});
        if(this.state.videoId !== this.state.match.videoId)
          this.setState({videoId:this.state.match.videoId});
        //fetch bets data
        this.setupBetsListener();
    });
  }

  componentWillUnmount() {
    this.unsubscribe_match();
    if(this.unsubscribe_bets) this.unsubscribe_bets();
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
        var timeLeftStr = hours.toString().padStart(2,"0")+':'+minutes.toString().padStart(2,"0")+':'+seconds.toString().padStart(2,"0");
        if (completed) {
            // Render a completed state
            return <Alert variant='warning' >Betting has ended.</Alert>;
        } else {
            // Render a countdown
            return <Alert variant='primary'>Betting ends in <b>{timeLeftStr}</b></Alert>;
        }
    }

  getReactKey = () => {
    var myBetKey = this.state.myBet? this.state.myBet.timestamp.toString(): '';
    return myBetKey + this.state.match.startTime.toString();
  }

  renderMatch = (match) => {
    if(this.state.hasMatchData) return (
        <Container className='border' style={{marginTop:10}}>
          <Row className="align-items-center">
            <Col xs={9} > <h4>{this.state.match.title}</h4><br/>
            <Countdown date={this.state.match.startTime.toDate()} renderer={this.renderer} key={this.state.match.startTime}/></Col>
            <Col xs={3}>
              {this.state.hasBetsData?
              (<MyBet match={this.state.match} myBet={this.state.myBet} user={this.props.user} key={this.getReactKey()}/>):
              (<Spinner animation="border" />)}
            </Col>
          </Row>
          <Row className="justify-content-center"><MatchBets bets={this.state.bets} match ={this.state.match} user={this.props.user}/></Row>
        </Container>)
     else return (
        <Container>
          <Row className="justify-content-center"><Spinner animation="border" />Fetching match details...          </Row>
        </Container>)
  }

  render() {
    return (
      <Container >
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <ResponsiveEmbed aspectRatio="16by9">
              <YouTube videoId={this.state.videoId} opts={this.opts} />
            </ResponsiveEmbed>
          </Col>
        </Row>
        <Row >
          <Col><Container >
            {this.renderMatch()}
          </Container></Col>
        </Row>
      </Container>
    )}
}

export default Match;