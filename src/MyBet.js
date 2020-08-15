import * as firebase from "firebase";
import React from 'react';
import { db } from './firebase';
import uuid from 'react-uuid'

import { Form , Row, Button, Container} from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


class MyBet extends React.Component {
  constructor(props) {
    super(props);
    console.log("MyBet:: props", props);
    this.state = {
        bettingActive:props.bettingActive,
        teamSelected:props.myBet?props.myBet.team:null,
        betAmount:props.myBet?props.myBet.betAmount:500,
        comment:props.myBet?props.myBet.comment:"",
    };
  }

  handleTeamPick = (e) => {
    // console.log("MyBet::radio--",e.target.id);
    this.setState({teamSelected:e.target.id});
  };

  handleBetAmountChange = (e) => {
    //   console.log("MyBet::slider--",e);
      this.setState({betAmount:e});
  };

  handleComment = (e) => {
      this.setState({comment:e.target.value});
  };
  
  placeBet = (e) => {
      console.log('MyBet:: now?',new Date().getTime());
      if(new Date()>this.props.match.startTime.toDate()) {
        alert('Oops! Betting has closed!');
        this.setState({bettingActive:false})
        return;
      }
      console.log("MyBet::placebet--",this.props);
      var matchId = this.props.matchId;
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
      var betOnTeamId = newBet.team == 'team1' ? this.props.match.team1 : this.props.match.team2;
      var betRef = db.collection('matches').doc(matchId)
                    .collection('bets').doc(user.uid);
      batch.set(betRef, newBet);

      var betVersionRef =db.collection('matches').doc(matchId)
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
      return (
        <Container>
        <Form.Group >
            <h3> Place Bet </h3>

            <Form.Label>Team (selected team wins &rArr; you make money)</Form.Label>
            <div key='inline-radio' className="mb-3">            
            <Form.Check checked={this.state.teamSelected=='team1'} name='team' type='radio' id='team1' label={this.props.match.team1} onChange={this.handleTeamPick}/>
            <Form.Check checked={this.state.teamSelected=='team2'} name='team' type='radio' id='team2' label={this.props.match.team2} onChange={this.handleTeamPick}/>
            </div>

            <Form.Label>Bet Amount {this.state.betAmount}</Form.Label>
            <Slider value={this.state.betAmount}
                onChange={this.handleBetAmountChange}
                size='lg' step={500} min={500} max={2000}/>

            <Form.Label>Quote</Form.Label>
            <Form.Control type="text"
                 value={this.state.comment} onChange={this.handleComment} />

            <br/>

            <Button variant="primary" onClick={this.placeBet}>Place Bet</Button>
        </Form.Group>
        </Container>
      )
  }

  render() {
    return (this.state.bettingActive 
        ? 
        this.getBetForm()
        : 
        (<span>Betting has closed.</span>))
  }
}

export default MyBet;