import { collection, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from './App.js'

function Leaderboard() {
  const [scenes, setScenes] = useState([]);
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    if (scenes.length === 0) {
      getScenes(db);
    }
  }, []);

  useEffect(() => {
    if (boards.length === 0) {
      getBoards(scenes);
    }
  }, [scenes]);

  async function getScenes(db) {
    const scenesCollection = collection(db, 'scenes');
    const scenesSnapshot = await getDocs(scenesCollection);
    const scenesList = scenesSnapshot.docs.map(doc => {return {id: doc.id, data: doc.data()}});
    setScenes(scenesList);
  }

  async function getBoards(scenes) {
    let boardList = await Promise.all(scenes.map(async (scene) => {
      const scores = await listScores(scene.id);
      const board =  {
        title: scene.data.title,
        id: scene.id,
        scores: scores
      }
      return board
    }))
    boardList.forEach(board => board.scores = sortScores(board.scores).slice(0))
    setBoards(boardList)
  }

  function sortScores(scores) {
    let sortedScores = scores.sort((a, b) => a.time - b.time);
    return sortedScores
  }

  async function listScores(scene) {
    const docRef = doc(db, 'leaderboard', scene);
    const scoresCollection = collection(docRef, 'scores');
    const scoresSnapshot = await getDocs(scoresCollection);
    const scoresList = scoresSnapshot.docs.map((doc) => {return doc.data()})
    return scoresList
  }

  return(
    <div className="leaderboard">
      {boards.length > 0 ? boards.map((board) => {
        return(<div className='scene'>
          <h2>{board.title}</h2>
          <ul>
            {board.scores.map(score =>
            <li>{`${score.name}: ${score.time}s`}</li>
            )}
            </ul>
        </div>)
      }) : 'loading...'}
    </div>
  )
}

export default Leaderboard