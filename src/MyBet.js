import * as firebase from "firebase";
import React from 'react';
import { db } from './firebase';
import uuid from 'react-uuid'

import { Form , Row, Button, Container, Modal, ButtonGroup, Image} from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import getTeams from './data'

class MyBet extends React.Component {
  constructor(props) {
    super(props);
    console.log("MyBet:: props", props);
    this.state = {
        bettingActive:props.bettingActive,
        showForm:false,
        teamSelected:props.myBet?props.myBet.team:null,
        betAmount:props.myBet?props.myBet.betAmount:500,
        comment:props.myBet?props.myBet.comment:"",
    };
  }

  handleTeamPick = (e) => {
    console.log("MyBet::radio--",e);
    this.setState({teamSelected:e});
  };

  handleBetAmountChange = (e) => {
    //   console.log("MyBet::slider--",e);
      this.setState({betAmount:e});
  };

  handleComment = (e) => {
      this.setState({comment:e.target.value});
  };
 
  handleFormClose = () => {this.setState({'showForm':false})};

  handleFormShow = () => {this.setState({'showForm':true})};

  getSelectedTeamName = () => {
    if(!this.state.teamSelected)
      return null;
    if(this.state.teamSelected==='team1')
      return getTeams()[this.props.match.team1]['short'];
    return getTeams()[this.props.match.team2]['short'];
  }
 
  placeBet = (e) => {
      console.log('MyBet:: now?',new Date().getTime());
      if(new Date()>this.props.match.startTime.toDate()) {
        alert('Oops! Betting has closed!');
        this.setState({bettingActive:false})
        this.handleFormClose();
        return;
      }
      console.log("MyBet::placebet--",this.props);
      var match = this.props.match;
      var user = this.props.user;

      var batch = db.batch();

      var newBet = {
            uid: user.uid,
            userName: user.email,
            displayName: user.displayName,
            team: this.state.teamSelected,
            betAmount: this.state.betAmount,
            comment: this.state.comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
            
        };
      var betOnTeamId = newBet.team == 'team1' ? match.team1 : match.team2;
      var betRef = db.collection('matches').doc(match.matchId)
                    .collection('bets').doc(user.uid);
      batch.set(betRef, newBet);

      var betVersionRef =db.collection('matches').doc(match.matchId)
                        .collection('bets').doc(user.uid)
                        .collection('versions').doc(uuid());
      batch.set(betVersionRef, newBet);

      var chatMessageRef =db.collection('messages').doc(uuid());
                        // .collection('matches').doc(matchId)
                        // .collection('versions').doc(uuid());
      var chatMessage = {
        type:'bet', 
        data:newBet, 
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        text: (newBet.displayName + " bet " + newBet.betAmount + " on "+ betOnTeamId)
      };

      batch.set(chatMessageRef, chatMessage);

      batch.commit().then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
  };

  getBetForm = () =>{
      return (<>
          <Button style={{height:'100%', margin:'10px'}} variant="primary" onClick={this.handleFormShow}>My Bet Button</Button>

          <Modal show={this.state.showForm} onHide={this.handleFormClose} backdrop='static' centered>
          <Modal.Header closeButton>
            <Modal.Title>Place Bet</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group >
              <Form.Label>Select Team  <small>&nbsp;({this.state.teamSelected?this.getSelectedTeamName():'Selected team '} wins &rArr; You make money)</small></Form.Label>
              <ButtonGroup>
                <Button variant={this.state.teamSelected==='team1'?'success':'secondary'} id='team1' onClick={() => this.handleTeamPick('team1')}><span>
                  {getTeams()[this.props.match.team1]['short']}&nbsp;&nbsp;
                  <Image src={getTeams()[this.props.match.team1]['logo']} style={{width:'48px', height:'48px', paddingLeft:'0', marginRight:'10px'}}></Image>
                  </span></Button>
 
                <Button variant={this.state.teamSelected==='team2'?'success':'secondary'} id='team2' onClick={() => this.handleTeamPick('team2')}><span>
                  <Image src={getTeams()[this.props.match.team2]['logo']} style={{width:'48px', height:'48px', paddingLeft:'0', marginLeft:'10px'}}></Image>
                  &nbsp;&nbsp;{getTeams()[this.props.match.team2]['short']}
                  </span></Button>
              </ButtonGroup>
            </Form.Group>
            <Form.Group >
              <Form.Label>Bet Amount <small>    (&#8377;{this.state.betAmount})</small></Form.Label>
              <Form.Row  style={{marginLeft:'30px', marginRight:'30px'}} >
              <Slider  value={this.state.betAmount}
                  onChange={this.handleBetAmountChange}
                  size='md' step={500} min={500} max={2000} marks={{500:'500',1000:'1000',1500:'1500',2000:'2000'}}/>
              </Form.Row>
            </Form.Group><Form.Group>
              <Form.Label>Quote</Form.Label>
              <Form.Control type="text"
                  placeholder='Cheer / Taunt...'
                  value={this.state.comment} onChange={this.handleComment} />

            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleFormClose}>Close</Button>
            <Button variant="primary" onClick={this.placeBet}>Place Bet</Button>
          </Modal.Footer>
        </Modal></>
      )
  }

  render() {
    return (
        this.getBetForm()
    ) 
  }
}

export default MyBet;