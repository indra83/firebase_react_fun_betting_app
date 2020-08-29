import React from 'react';

import { db } from './firebase';
import {Container, Spinner, ListGroup} from 'react-bootstrap';

class ChatWidget extends React.Component {
  constructor(props) {
    super(props);
    console.log('ChatWidget::props',props);
    this.state={
        isLoading:true,
        chatMessages: []
    }
  }

  componentDidMount() {
    this.unsubscribe = db.collection("messages").orderBy('timestamp','desc').limit(200).onSnapshot(
      snapshot => {
        console.log('ChatWidget::snapshot--',snapshot);
        // if (snapshot.metadata.hasPendingWrites) {console.log("has pending writes",snapshot);return;}
        var messages = []
        snapshot.forEach(doc => {
                messages.push(doc.data())
            })
        this.setState({
          isLoading: false,
          chatMessages: messages
        })
        console.log('ChatWidget::newMessage', messages);
      },
      err => {
          console.log("ChatWidget::error");
        this.props.showToast(0, err.toString())
      }
    )
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getTeamTitle = (teamId) => {
      var titles = {kp:'Kasi Purugulu',hnb:'Huns n Buns',hits:'High in the Sky',bcb:'Best Coast Boys',gnb:'Guns n B**bs'};
      return titles[teamId];
  }

  getMessageTimeString = (message) => {
    if(message.timestamp) return message.timestamp.toDate().toLocaleTimeString();
    return new Date().toLocaleTimeString();
  }

  renderLoading=()=>(<span><Spinner animation="border" />Fetching chat messages...</span>)

  renderMessage = (message) =>(
    <ListGroup.Item key={message.timestamp}>
      <div>
      <span style={{fontSize: '0.75em'}}>{this.getMessageTimeString(message)}</span>
      <span style={{fontSize: '1em', fontStyle: 'bold'}}>{ message.text}</span>
      <br/>
      <span  style={{fontSize: '1.4em', fontStyle: 'italic' }}>&nbsp;&nbsp;{message.data.comment}</span>
    </div>
</ListGroup.Item>

  )

  render() {
    return (
            this.state.isLoading? this.renderLoading:
            (
            <ListGroup variant="flush">
                {this.state.chatMessages.map(this.renderMessage)}
                </ListGroup>
            )
    )  }
}

export default ChatWidget;