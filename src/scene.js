import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { useEffect, useState } from 'react';
import { db } from './App.js'



function Scene(props) {

  const [scene, setScene] = useState();
  const [locations, setLocations] = useState([]);
  const [finds, setFinds] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

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

  useEffect(() => {
    if (locations.length > 0) {
      setIsActive(true)
    }
  }, [locations])

  useEffect(() => {
    if(isActive && checkWin()) {
      setIsActive(false);
      enterScore();
    }
  }, [finds])

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
          }
        }
        else {
          console.log('incorrect');
        }
      }
    }
  }

  function checkWin() {
    console.log(finds)
    if (locations.length === finds.length) {
      console.log('win!');
    }
  }

  function enterScore() {
    let name = prompt('name?');
    ( async() => {
      await setDoc(doc(db, 'leaderboard', id), {
        scene: id,
        name: name,
        time: seconds
      })  
    })()  
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
      <h3>{seconds}</h3>
      <img src={scene ? scene.img : null} onClick={placeGuess}></img>
    </div>
  )
}

export default Scene