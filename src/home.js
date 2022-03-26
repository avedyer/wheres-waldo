import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { db } from './App.js'

function Home(props) {

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

  return(
    <div id="home">
      <h2>Play:</h2>
      <div id='scene-list'>
      {scenes.map((scene) =>
        <Link to={`/scene/${scene.id}`}>
          <div className='frame'>
            <h3>{scene.data.title}</h3>
            <img src={scene.data.img} />
          </div>
        </Link>
      )}
      </div>
    </div>
  )
}

export default Home