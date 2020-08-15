import React from 'react';

import { db } from './firebase';
import {Container, Spinner, } from 'react-bootstrap';

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
    this.unsubscribe = db.collection("messages").onSnapshot(
      snapshot => {
        var messages = [...this.state.chatMessages]
        snapshot.docChanges().forEach(change => {
              if (change.type === 'added') {
                messages.push(change.doc.data())
              }
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

  renderLoading=()=>(<span><Spinner animation="border" />Fetching chat messages...</span>)

  render() {
    return (
            this.state.isLoading? this.renderLoading:
            (
                <>
                {this.state.chatMessages.map(message=>(<div>{message.text}</div>))}
                </>
            )
    )  }
}

export default ChatWidget;