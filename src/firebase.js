import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAMJ45GxI1Xrd3wuzvKtdKK0QpXRxU5DGw",
  authDomain: "gcg2020-acce8.firebaseapp.com",
  databaseURL: "https://gcg2020-acce8.firebaseio.com",
  projectId: "gcg2020-acce8",
  storageBucket: "gcg2020-acce8.appspot.com",
  messagingSenderId: "459652549025",
  appId: "1:459652549025:web:eabc1e800d2990a80e23e0",
  measurementId: "G-1XTJQ8V26V"
};

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth;
export const db = firebase.database();