import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore"
import { useEffect, useState } from 'react';
import { db } from './App.js'



function Scene(props) {

  const [scene, setScene] = useState();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    if (!scene) {
      getScene(id);
      if(locations.length === 0) {
        getLocations(id)
      }
    }
  }, []);

  function placeGuess(e) {
    console.log(e.target)
    console.log(locations)
  }

  const id = window.location.pathname.split('/').slice(-1)[0];

  async function getScene(id) {
    const docRef = doc(db, 'scenes', id);
    const sceneSnapshot = await getDoc(docRef);
    setScene(sceneSnapshot.data())
  }

  async function getLocations(id) {
    const docRef = doc(db, 'scenes', id);
    const locationsCollection = collection(docRef, 'locations');
    const locationsSnapshot = await getDocs(locationsCollection);
    const locationsList = locationsSnapshot.docs.map(doc => {return {name: doc.data().name, coords: doc.data().coords}});
    setLocations(locationsList);
  }

  return (
    <div className="scene">
      <h1>{scene ? scene.title : 'loading...'}</h1>
      <img src={scene ? scene.img : null} onClick={placeGuess}></img>
    </div>
  )
}

export default Scene