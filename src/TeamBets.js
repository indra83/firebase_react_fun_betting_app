import React from 'react';

import {Card, ListGroup, Container, Row, Col, Badge, Image} from 'react-bootstrap';

import getTeams from './data'
import getUserDP from './user'

class TeamBets extends React.Component {
  constructor(props) {
    super(props);
    console.log('TeamBets::props',props);
    this.teamId = props.whichTeam == 'team1' ? props.match.team1 : props.match.team2;
    // this.img = 'https://www.himalmag.com/wp-content/uploads/2019/07/sample-profile-picture.png';
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
            <Card.Text>Total <h3><Badge variant="primary">{this.props.bets.reduce((total, bet)=>{return total + bet.betAmount}, 0)}</Badge></h3></Card.Text>
            <ListGroup variant="flush">
                {this.props.bets.map(bet=>(<ListGroup.Item key={bet.uid}>
                    <Container style={{padding:0}}><Row className="align-items-center" style={{margin:0}}>
                        <Col ><Image src={getUserDP(bet.uid).dp} 
                            style={{width:'84px', height:'120px', paddingLeft:'0', paddingRight:'0'}}></Image></Col>
                        <Col >
                            <span style={{fontSize:'0.75em', textOverflow:'ellipsis', whiteSpace:'pre'}}>{bet.displayName}</span><br/>
                            <Badge pill variant='success'>{bet.betAmount}</Badge></Col>
                    </Row></Container>
                    </ListGroup.Item>))}
            </ListGroup>
        </Card>
    )  }
}

export default TeamBets;