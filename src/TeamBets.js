import React from 'react';

import {Card, ListGroup} from 'react-bootstrap';

class TeamBets extends React.Component {
  constructor(props) {
    super(props);
    console.log('TeamBets::props',props);
    this.teamId = props.whichTeam == 'team1' ? props.match.team1 : props.match.team2;
  }

  getTeamTitle = (teamId) => {
      var titles = {kp:'Kasi Purugulu',hnb:'Huns n Buns',hits:'High in the Sky',bcb:'Best Coast Boys',gnb:'Guns n B**bs'};
      return titles[teamId];
  }

  render() {
    return (
        <Card>
            <Card.Img variant='top' src='https://images.pexels.com/photos/38278/tiger-head-wildlife-animal-38278.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'/>
            <Card.Title>{this.getTeamTitle(this.teamId)}</Card.Title>
            <Card.Text>Total: {this.props.bets.reduce((total, bet)=>{return total + bet.betAmount}, 0)}</Card.Text>
            <ListGroup variant="flush">
                {this.props.bets.map(bet=>(<ListGroup.Item>{bet.displayName + "--" + bet.betAmount}</ListGroup.Item>))}
            </ListGroup>
        </Card>
    )  }
}

export default TeamBets;