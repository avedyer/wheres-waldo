import { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, getFirestore } from "firebase/firestore"

import Scene from "./scene.js"
import Home from './home.js'
import './App.css';
import Leaderboard from './leaderboard.js';


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

const db = getFirestore(app);

function App() {


  return(
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home db={db}/>}/>
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route exact path='/scene/:id' element={<Scene />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )

  /*
  return (
    <div className="App">
      {scenes.map((scene) => 
        <Scene data={scenes.length > 0 ? scene.data : null} id={scenes.length > 0 ? scene.id : null} db={db}/>
      )}
    </div>
  );
  */
}

export { db, App }