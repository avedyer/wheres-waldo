import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { useEffect, useState } from 'react';
import { db } from './App.js'



function Scene(props) {

  const [scene, setScene] = useState();
  const [locations, setLocations] = useState([]);
  const [finds, setFinds] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!scene) {
      getScene(id);
      if(locations.length === 0) {
        getLocations(id)
      }
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } 
    else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds])

  function placeGuess(e) {

    if (!locations) {
      return
    }

    let offsetX = e.target.offsetLeft - window.scrollX;
    let offsetY = e.target.offsetTop - window.scrollY;

    let coords = [Math.floor(e.clientX - offsetX), Math.floor(e.clientY - offsetY)]
    let name = prompt('name?');

    for (let location of locations) {
      if (location.name === name) {
        if (Math.abs(coords[0] - location.coords[0]) < 30) {
          console.log('correct');
          if (!finds.includes(name)) {
            setFinds([...finds, name]);
            if (checkWin()) {
              //enterScore();
            }
          }
        }
        else {
          console.log('incorrect');
        }
      }
    }
  }

  function checkWin() {
    if (locations.length === finds.length) {
      return true;
    }
    return false
  }

  
  const start = new Date()
  console.log(start)
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
      <h3>{seconds}</h3>
      <img src={scene ? scene.img : null} onClick={placeGuess}></img>
    </div>
  )
}

export default Scene