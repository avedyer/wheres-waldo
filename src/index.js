import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyB-Hj9OXX5X2Blt2afOEu-TKJAFrXcTMxk",
  authDomain: "wheres-waldo-89d05.firebaseapp.com",
  projectId: "wheres-waldo-89d05",
  storageBucket: "wheres-waldo-89d05.appspot.com",
  messagingSenderId: "98230653088",
  appId: "1:98230653088:web:e340cc03c4e8f75a51b9c5",
  measurementId: "G-TV7XMG45MQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

console.log(app);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
