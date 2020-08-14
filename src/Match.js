import React from 'react';

class Match extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return <h1>Hello, {this.props.user.email}</h1>;
  }
}

export default Match;