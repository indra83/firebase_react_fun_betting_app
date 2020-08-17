import React from 'react';
import { db } from './firebase';

import Spinner from 'react-bootstrap/Spinner';
import Countdown from 'react-countdown';
import YouTube from 'react-youtube';

import MatchBets from './MatchBets';
import { Alert, Button, Container, Row, Col, ResponsiveEmbed } from 'react-bootstrap';

class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      match:null,
      videoId:'nNQMVC_njf0'
    }
    this.opts = {
      height: 'auto',
      width: 'auto',
      playerVars: {
       autoplay: 0,
      },
    }
  }

  componentDidMount() {
    this.unsubscribe = db.collection("matches").doc("testmatch")
    .onSnapshot((doc) => {
        console.log("Match::Current data: ", doc.data());
        console.log("Match::Doc:",doc);
        this.setState({match: doc.data(), matchId: doc.id});
        if(this.state.videoId != doc.data().videoId)
          this.setState({videoId:doc.data().videoId});
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
        var timeLeftStr = hours.toString()+':'+minutes.toString()+':'+seconds.toString();
        if (completed) {
            // Render a completed state
            return <Alert variant='warning' >Betting has ended.</Alert>;
        } else {
            // Render a countdown
            return <Alert variant='primary'>Betting ends in <b>{timeLeftStr}</b> <Button>blah</Button></Alert>;
        }
    }

  renderMatch = (match) => {
    if(match ) return (
        <Container className='border'>
          <Row className="justify-content-center"><h3>{this.state.match.title}</h3></Row>
          <Row className="justify-content-center"><Countdown date={this.state.match.startTime.toDate()} renderer={this.renderer}/></Row>
          <Row className="justify-content-center"><MatchBets matchId={this.state.matchId} match ={this.state.match} user={this.props.user}/></Row>
            
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
          <Col>
            <ResponsiveEmbed aspectRatio="16by9">
              <YouTube videoId={this.state.videoId} opts={this.opts} />
            </ResponsiveEmbed>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col><Container >
            {this.renderMatch(this.state.match)}
          </Container></Col>
        </Row>
      </Container>
    )}
}

export default Match;