import React from 'react';
import { db } from './firebase';

import MyBet from './MyBet';
import {Spinner, Container, Row, Col } from 'react-bootstrap';

class MatchBets extends React.Component {
  constructor(props) {
    super(props);
    this.bettingActive = props.match.startTime.toDate().getTime() > new Date().getTime();
    console.log("props",this.props);
    this.state={
        hasBetsData: false, 
        myBet: null
    };
  }

  componentDidMount() {
    this.unsubscribe = db.collection("matches").doc(this.props.matchId).collection("bets")
    .onSnapshot((querySnapshot) => {
        var betsByUser = {};
        querySnapshot.forEach(function(doc) {
            betsByUser[doc.id] = doc.data()
        });
        console.log("MatchBets::Current data: ", betsByUser);
        this.setState({
            hasBetsData: true, 
            betsByUser:betsByUser, 
            myBet:betsByUser[this.props.user.id]
        });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
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
                        <MyBet myBet={this.state.myBet}
                            matchId={this.props.matchId}
                            bettingActive={this.bettingActive} 
                            match={this.props.match}
                            user={this.props.user}/>
                    </Col>
                </Row></>)
                : 
                (<span><Spinner animation="border" />Fetching match bets...</span>)
             }
        </Container>)

  }
}

export default MatchBets;