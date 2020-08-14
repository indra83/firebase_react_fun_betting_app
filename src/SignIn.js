import React, {useState} from 'react';
import { auth } from './firebase';
import Button from 'react-bootstrap/Button';

class SignIn extends React.Component {
//   const [isLoading, setLoading] = useState(false);

  constructor(props) {
    super(props);
    this.provider = new auth.GoogleAuthProvider();
  }

  beginSignIn = (e) => {
      return auth().signInWithPopup(this.provider);
  }

  render() {
    return <Button variant="primary" onClick={this.beginSignIn}>Sign In with Google</Button>;
  }
}

export default SignIn;