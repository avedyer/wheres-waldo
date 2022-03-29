import { collection, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react'
import { db } from './App.js'

function Leaderboard() {

  //Returns a leaderboard page which can be toggled between data for different scenes.
  
  const [scenes, setScenes] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selection, setSelection] = useState();

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

  useEffect(() => {
    if (!selection) {
      setSelection(boards[0])
    }
  }, [boards])

  //Fetch scene data from firestore

  async function getScenes(db) {
    const scenesCollection = collection(db, 'scenes');
    const scenesSnapshot = await getDocs(scenesCollection);
    const scenesList = scenesSnapshot.docs.map(doc => {return {id: doc.id, data: doc.data()}});
    setScenes(scenesList);
  }

  //Fetch score data from firestore and sort by lowest time

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
    setBoards(boardList);
  }

  //Sorts a score array in terms of lowest time

  function sortScores(scores) {
    let sortedScores = scores.sort((a, b) => a.time - b.time);
    return sortedScores
  }

  //Fetches an array of score data given the id of a scene

  async function listScores(scene) {
    const docRef = doc(db, 'leaderboard', scene);
    const scoresCollection = collection(docRef, 'scores');
    const scoresSnapshot = await getDocs(scoresCollection);
    const scoresList = scoresSnapshot.docs.map((doc) => {return doc.data()})
    return scoresList
  }

  return(
    <div className="leaderboard">
      <div className='options'>
        {selection ?
          boards.map((board) => {
            return(
              <h3 className={`title ${selection.id === board.id ? 'selected' : ''}`} onClick={() => {setSelection(board)}}>{board.title}</h3>
            )
          }): ''}
      </div>
      <div className='scores'>
        {selection ? 
          <table>
            <tr>
              <th>Name</th>
              <th>Time</th>
            </tr>
            {selection.scores ? selection.scores.map(score =>{
              return(
                <tr>
                  <td>{score.name}</td>
                  <td>{score.time}s</td>
                </tr>
              )
            }
            ) : 'loading...'}
          </table>
          : 'loading...'}
      </div>
    </div>
  )
}

export default Leaderboard