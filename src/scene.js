import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { useEffect, useState } from 'react';
import { db } from './App.js'

import waldo from './imgs/waldo.jpg'
import wenda from './imgs/wenda.jpg'
import odlaw from './imgs/odlaw.jpg'
import wizard from './imgs/wizard.gif'
import CharacterForm from "./characterForm.js";

function Scene() {
  const [scene, setScene] = useState();
  const [locations, setLocations] = useState([]);
  const [finds, setFinds] = useState([]);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [guessing, setIsGuessing] = useState(false)
  const [coords, setCoords] = useState([])

  const icons = [
    {name: 'Waldo', src: waldo},
    {name: 'Wenda', src: wenda},
    {name: 'Odlaw', src: odlaw},
    {name: 'Wizard', src: wizard},
  ]

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
        setTime(time => time + 1);
      }, 1000);
    } 
    else if (!isActive && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time])

  useEffect(() => {
    if (locations.length > 0) {
      setIsActive(true)
    }
  }, [locations])

  useEffect(() => {
    if(isActive && checkWin()) {
      console.log('entering score')
      setIsActive(false);
      enterScore();
    }
  }, [finds])

  function clickCoords(e) {
    return [e.clientX, e.clientY];
  }

  function placeGuess(e) {

    if (!locations) {
      return
    }

    setIsGuessing(true);

    setCoords([e.clientX, e.clientY])

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
    setIsGuessing(false)
  }

  function checkWin() {
    console.log(finds)
    if (locations.length === finds.length) {
      console.log('win!');
      return true
    }
    return false
  }

  function enterScore() {
    let name = prompt('name?');
    ( async() => {
      await setDoc(doc(db, 'leaderboard', id), {
        scene: id,
        name: name,
        time: time
      })  
    })()  
  }

  function clockTime(time) {
    let minutes = Math.floor(time / 60);
    let hours = Math.floor(minutes / 60);
    let seconds = time % 60;
    minutes = minutes % 60;

    return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
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
    <div id="scene">
      <h1>{scene ? scene.title : 'loading...'}</h1>
      <h3>{clockTime(time)}</h3>
      <div className="cast">
        {icons.map((icon) => {
          return <img src={icon.src} className={`icon ${finds.includes(icon.name) ? 'found' : ''}`}/>
        })}
      </div>
      <img src={scene ? scene.img : null} onClick={placeGuess}></img>
      {guessing ? <CharacterForm icons={icons} finds={finds} coords={coords}/> : ''}
    </div>
  )
}

export default Scene