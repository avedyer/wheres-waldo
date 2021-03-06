import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { useEffect, useState } from 'react';
import { db } from './App.js'

import waldo from './imgs/waldo.jpg'
import wenda from './imgs/wenda.jpg'
import odlaw from './imgs/odlaw.jpg'
import wizard from './imgs/wizard.gif'

import CharacterForm from "./characterForm.js";
import ScoreForm from "./scoreForm.js";

function Scene() {
  /*
    Returns a scene element with toggleable subcomponents for submitting guesses and scores.
    Scene and character data is pulled from firestore.
    CharacterForm for submitting guesses and ScoreForm for submitting scores are displayed based on state variables defining the current status of the game.
  */

  const [scene, setScene] = useState();
  const [locations, setLocations] = useState([]);
  const [finds, setFinds] = useState([]);
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [guessing, setIsGuessing] = useState(false)
  const [offsetCoords, setOffsetCoords] = useState([])
  const [percentCoords, setPercentCoords] = useState([])
  const [guess, setGuess] = useState();
  const [validScene, setValidScene] = useState(true);
  const [icons, setIcons] = useState([
    {name: 'Waldo', src: waldo},
    {name: 'Wenda', src: wenda},
    {name: 'Odlaw', src: odlaw},
    {name: 'Wizard', src: wizard},
  ])
  const [won, setWon] = useState(false)

  

  useEffect(() => {
    if (!scene) {
      getScene(id);
      if(locations.length === 0) {
        getLocations(id)
      }
    }
  }, []);

  //Timer function, activates upon loading of scene data

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

  //Removes icons for characters who are not in the scene

  useEffect(() => {
    if (locations.length > 0) {
      let names = locations.map(location => location.name);
      let trimIcons = []
      setIsActive(true)
      icons.forEach((icon) => {
        if(names.includes(icon.name)) {
          trimIcons.push(icon)
        }
      })
      setIcons(trimIcons.splice(0))
    }
  }, [locations])

  useEffect(() => {
    checkGuess(percentCoords, guess)
  }, [guess])

  useEffect(() => {
    if(isActive && checkWin()) {
      setIsActive(false);
      setWon(true)
    }
  }, [finds])

  const id = window.location.pathname.split('/').slice(-1)[0]; //id of scene within database is passed to the Scene element through the url

  //Checks for valid scene id and passes it to state

  async function getScene(id) {
    const docRef = doc(db, 'scenes', id);
    const sceneSnapshot = await getDoc(docRef);
    if(!sceneSnapshot.data()) {
      setValidScene(false);
    }
    else{
      setScene(sceneSnapshot.data())
    }
  }

  //Fetches character locations from particular scene

  async function getLocations(id) {
    const docRef = doc(db, 'scenes', id);
    const locationsCollection = collection(docRef, 'locations');
    const locationsSnapshot = await getDocs(locationsCollection);
    const locationsList = locationsSnapshot.docs.map(doc => {return {name: doc.data().name, coords: doc.data().coords}});
    setLocations(locationsList);
  }

  function closeForm() {
    setIsGuessing(false);
  }

  //Converts number of seconds to HH:MM:SS format

  function clockTime(time) {
    let minutes = Math.floor(time / 60);
    let hours = Math.floor(minutes / 60);
    let seconds = time % 60;
    minutes = minutes % 60;

    return `${hours}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
  }

  function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top
    };
  }

  //Retrieves guess data from pop-up form

  function passGuess(name) {
    setGuess(name);
  }

  //Defines guess in terms of ratio between the location of the user's click and the total size of the image on a 0 to 1 scale.

  function placeGuess(e) {

    if (!locations) {
      return
    }

    setIsGuessing(true);

    let offset = getOffset(document.getElementById('scene'));
    let size = [e.target.width, e.target.height];
    let coords = [Math.floor(e.clientX - offset.left), Math.floor(e.clientY - offset.top)];
    setPercentCoords([(coords[0]/size[0]), (coords[1]/size[1])])
    setOffsetCoords(coords);
  }

  //Compares user guess against database info

  function checkGuess(coords, name) {
    for (let location of locations) {
      if (location.name === name &&
        Math.abs(coords[0] - location.coords[0]) < .03 &&
        Math.abs(coords[1] - location.coords[1]) < .03 &&
        !finds.includes(name)) {
            setFinds([...finds, name]);
      }
    }
    setIsGuessing(false)
  }

  function checkWin() {
    return locations.length === finds.length
  }

  //Pushes score data retrieved from pop-up form to database

  function enterScore(name) {
    ( async(name) => {
      const sceneRef = doc(db, 'leaderboard', id);
      await setDoc(doc(sceneRef, 'scores', name), {
        name: name,
        time: time
      })  
    })(name)  
  }

  if(validScene) {
    return (
    <div id="game">
      <h1>{scene ? scene.title : 'loading...'}</h1>
      <div className='info'>
        <h3>{clockTime(time)}</h3>
        <div className="cast">
          {icons.map((icon) => 
              <img src={icon.src} className={`icon ${finds.includes(icon.name) ? 'found' : ''}`}/>
          )}
        </div>
      </div>
      <div>
        <img id="scene" src={scene ? scene.img : null} onClick={placeGuess}></img>
      </div>
      {guessing ? <CharacterForm icons={icons} finds={finds} coords={offsetCoords} closeForm={closeForm} passGuess={passGuess}/> : ''}
      {won ? <ScoreForm enterScore={enterScore} /> : ''}
    </div>
    )
  }
  else {
    return (
      <h1 className="Error">
        Error: invalid url
      </h1>
    )
  }
}

export default Scene