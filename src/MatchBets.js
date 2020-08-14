import React from 'react';
import { db } from './firebase';

import Spinner from 'react-bootstrap/Spinner';
import { Container, Row, Col } from 'react-bootstrap';

class MatchBets extends React.Component {
  constructor(props) {
    super(props);
    console.log("props",this.props);
    this.state={hasBetsData: false, match: props.match, bettingActive: (props.match.startTime.toDate()>new Date())};
  }

  componentDidMount() {
    this.unsubscribe = db.collection("matches").doc(this.props.matchId).collection("bets")
    .onSnapshot((querySnapshot) => {
        var betsByUser = {};
        querySnapshot.forEach(function(doc) {
            betsByUser[doc.id] = doc.data()
        });
        console.log("Current data: ", betsByUser);
        this.setState({hasBetsData: true, betsByUser:betsByUser, userBet:null});
    });
    // Redraw after betting window closes
    this.betActiveTimer = setTimeout(() => {this.setState({bettingActive: false})}, this.props.match.startTime.toDate() - new Date());
  }

  componentWillUnmount() {
    this.unsubscribe();
    clearTimeout(this.betActiveTimer);
  }

  render() {
    return (
        <Container>
            {this.state.hasBetsData ? 
                (<><Row>
                    <Col> <span>{this.state.betsByUser.length}</span></Col>
                    <Col> <span>{this.state.betsByUser.length}</span></Col>
                </Row>
                <Row>
                    <Col>
                        {this.state.bettingActive
                        ?
                        (<span>Place bets</span>)
                        :
                        (<span>Betting closed</span>)}
                    </Col>
                </Row></>)
                : 
                (<span><Spinner animation="border" />Fetching match bets...</span>)
             }
        </Container>)

  }
}

export default MatchBets;