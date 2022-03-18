import './App.css';
import { useEffect, useState } from 'react';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { collection, getDocs, getFirestore } from "firebase/firestore"

import Scene from "./scene.js"


const firebaseConfig = {
  apiKey: "AIzaSyB-Hj9OXX5X2Blt2afOEu-TKJAFrXcTMxk",
  authDomain: "wheres-waldo-89d05.firebaseapp.com",
  projectId: "wheres-waldo-89d05",
  storageBucket: "wheres-waldo-89d05.appspot.com",
  messagingSenderId: "98230653088",
  appId: "1:98230653088:web:e340cc03c4e8f75a51b9c5",
  measurementId: "G-TV7XMG45MQ"
};

function App() {

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const db = getFirestore(app);

  const [scenes, setScenes] = useState([]);

  useEffect(() => {
    if (scenes.length === 0) {
      getScenes(db);
    }
  }, []);

  async function getScenes(db) {
    const scenesCollection = collection(db, 'scenes');
    const scenesSnapshot = await getDocs(scenesCollection);
    const scenesList = scenesSnapshot.docs.map(doc => {return {id: doc.id, data: doc.data()}});
    setScenes(scenesList);
  }

  return (
    <div className="App">
      <Scene data={scenes.length > 0 ? scenes[0].data : null} id={scenes.length > 0 ? scenes[0].id : null} db={db}/>
    </div>
  );
}

export default App;
