import * as firebase from "firebase";
import React from 'react';
import { db } from './firebase';
import uuid from 'react-uuid'

import { Form , Row, Button} from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';


class MyBet extends React.Component {
  constructor(props) {
      console.log("MyBet:: props", props);
    super(props);
    this.state = {
        match:props.match,
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
      console.log("MyBet::placebet--",this.props);
      var matchId = this.props.matchId;
      var user = this.props.user;

      var batch = db.batch();

      var newBet = {
            userName: user.email,
            displayName: user.displayName,
            team: this.state.teamSelected,
            betAmount: this.state.betAmount,
            comment: this.state.comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
            
        };

      var betRef = db.collection('matches').doc(matchId)
                    .collection('bets').doc(user.uid);
      batch.set(betRef, newBet);

      var betVersionRef =db.collection('matches').doc(matchId)
                        .collection('bets').doc(user.uid)
                        .collection('versions').doc(uuid());
      batch.set(betVersionRef, newBet);

      batch.commit().then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
  };

  getBetForm = () =>{
      return (
        <Form.Group >
            <h3> Place Bet </h3>

            <Form.Label>Team (selected team wins &rArr; you make money)</Form.Label>
            <div key='inline-radio' className="mb-3">            
            <Form.Check checked={this.state.teamSelected=='team1'} name='team' type='radio' id='team1' label={this.state.match.team1} onChange={this.handleTeamPick}/>
            <Form.Check checked={this.state.teamSelected=='team2'} name='team' type='radio' id='team2' label={this.state.match.team2} onChange={this.handleTeamPick}/>
            </div>

            <Form.Label>Bet Amount</Form.Label>
            <Slider value={this.state.betAmount}
                onChange={this.handleBetAmountChange}
                size='lg' step={500} min={500} max={2000}/>

            <Form.Label>Quote</Form.Label>
            <Form.Control size="lg" type="text"
                 value={this.state.comment} onChange={this.handleComment} />

            <Button variant="primary" onClick={this.placeBet}>Place Bet</Button>;
        </Form.Group>
      )
  }

  render() {
    return (this.props.bettingActive 
        ? 
        this.getBetForm()
        : 
        (<span>Betting has closed.</span>))
  }
}

export default MyBet;