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

  componentDidMount() {
    this.unsubscribe = db.collection("matches").doc(this.props.matchId).collection("bets")
    .onSnapshot((querySnapshot) => {
        var myBet;
        var bets = {'team1':[], 'team2':[]} 

        querySnapshot.forEach((doc) => {
          var bet = doc.data();
          if(doc.id==this.props.user.uid) myBet = bet;
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

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
        <Container>
            {this.state.hasBetsData ? 
                (<><Row>
                    <Col> <TeamBets whichTeam='team1' match={this.props.match} bets={this.state.bets['team1']}/></Col>
                    <Col> <TeamBets whichTeam='team2' match={this.props.match} bets={this.state.bets['team2']}/></Col>
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