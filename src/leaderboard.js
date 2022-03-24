import { collection, doc, getDocs } from 'firebase/firestore';
import { useEffect } from 'react'
import db from './home'

function Leaderboard() {
  const [scenes, setScenes] = useEffect([]);

  async function getScenes(db) {
    const scenesCollection = collection(db, 'leaderboard');
    const scenesSnapshot = await getDocs(scenesCollection);
    const scenesList = scenesSnapshot.docs.map(doc => {return {id: doc.id, data: doc.data()}});
    setScenes(scenesList);
  }

  async function getScores(scene) {
    const docRef = doc(db, 'leaderboard', scene);
    const scoresCollection = collection(docRef, 'scores');
    const scoresSnapshot = await getDocs(scoresCollection);
    const scoresList = scoresSnapshot.map((score) => {return doc.data()})
  }

  return(
    <div className="leaderboard">
      <h1>
        leaderbaord
      </h1>
    </div>
  )
}

export default Leaderboard