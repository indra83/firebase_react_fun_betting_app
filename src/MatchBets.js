import React from 'react';
import { db } from './firebase';

import MyBet from './MyBet';
import TeamBets from './TeamBets';
import {Spinner, Container, Row, Col } from 'react-bootstrap';

class MatchBets extends React.Component {
  constructor(props) {
    super(props);
    this.bettingActive = props.match.startTime.toDate().getTime() > new Date().getTime();
    console.log("MatchBets::props",this.props);
    this.state={
        hasBetsData: false, 
        myBet: null
    };
  }

  render() {
    return (
        <Container>
            {this.props.bets ? 
                (<><Row>
                    <Col> <TeamBets whichTeam='team1' match={this.props.match} bets={this.props.bets['team1']}/></Col>
                    <Col> <TeamBets whichTeam='team2' match={this.props.match} bets={this.props.bets['team2']}/></Col>
                </Row></>)
                : 
                (<span><Spinner animation="border" />Fetching match bets...</span>)
             }
        </Container>)

  }
}

export default MatchBets;