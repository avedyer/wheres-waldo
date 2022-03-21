import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore"
import { useParams } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { db } from './App.js'


function Scene(props) {

  const [scene, setScene] = useState();

  useEffect(() => {
    if (!scene) {
      getScene(id);
    }
  }, []);

  const id = window.location.pathname.split('/').slice(-1)[0];

  async function getScene(id) {
    const docRef = doc(db, 'scenes', id);
    const sceneSnapshot = await getDoc(docRef);
    setScene(sceneSnapshot.data())
  }

  return (
    <div className="scene">
      <h1>{scene ? scene.title : 'loading...'}</h1>
      <img src={scene ? scene.img : null}></img>
    </div>
  )
}

export default Scene