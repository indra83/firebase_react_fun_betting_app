import React from 'react';

import {Card, ListGroup} from 'react-bootstrap';

import getTeams from './data'

class TeamBets extends React.Component {
  constructor(props) {
    super(props);
    console.log('TeamBets::props',props);
    this.teamId = props.whichTeam == 'team1' ? props.match.team1 : props.match.team2;
  }

  getTeamTitle = (teamId) => {
      console.log('team bets::teams--',getTeams());
      return getTeams()[teamId]['name'];
  }

  getTeamLogo = (teamId) => {
      console.log('team bets::teams--',getTeams());
      return getTeams()[teamId]['logo'];
  }
  render() {
    return (
        <Card>
            <Card.Img variant='top' src={this.getTeamLogo(this.teamId)}/>
            <Card.Title>{this.getTeamTitle(this.teamId)}</Card.Title>
            <Card.Text>Total: {this.props.bets.reduce((total, bet)=>{return total + bet.betAmount}, 0)}</Card.Text>
            <ListGroup variant="flush">
                {this.props.bets.map(bet=>(<ListGroup.Item key={bet.uid}>{bet.displayName + "--" + bet.betAmount}</ListGroup.Item>))}
            </ListGroup>
        </Card>
    )  }
}

export default TeamBets;