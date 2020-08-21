import React from 'react';

import {Card, ListGroup, Container, Row, Col, Badge, Image} from 'react-bootstrap';

import getTeams from './data'
import getUserUI from './user'

class TeamBets extends React.Component {
  constructor(props) {
    super(props);
    console.log('TeamBets::props',props);
    this.teamId = props.whichTeam == 'team1' ? props.match.team1 : props.match.team2;
    this.img = 'https://www.himalmag.com/wp-content/uploads/2019/07/sample-profile-picture.png';
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
                {this.props.bets.map(bet=>(<ListGroup.Item key={bet.uid}>
                    <Container><Row>
                        <Col xs={3}><Image src={this.img} className='thumbnail'
                            style={{width:'48px', height:'48px', paddingLeft:'0', paddingRight:'0'}}></Image></Col>
                        <Col xs={6}><span style={{fontSize:'0.5em', textOverflow:'ellipsis', whiteSpace:'pre'}}>{bet.displayName}</span></Col>
                        <Col xs={3}><Badge variant='success'>{bet.betAmount}</Badge></Col>
                    </Row></Container>
                    </ListGroup.Item>))}
            </ListGroup>
        </Card>
    )  }
}

export default TeamBets;