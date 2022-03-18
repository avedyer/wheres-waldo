import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore"

function Scene(props) {
  async function writeLocation(e) {
    let offsetX = e.target.offsetLeft;
    let offsetY = e.target.offsetTop;
    let coords = [e.clientX - offsetX, e.clientY - offsetY];

    const sceneRef = doc(props.db, 'scenes', props.id)
    const sceneData = await getDoc(sceneRef)
    
    let name = prompt('name?');
    
    await setDoc(doc(sceneRef, 'locations', name), {
      name: `${name}`,
      coords: `${coords}`
    });
  }

  return (
    <div className="scene">
      <h1>{props.data ? props.data.title : 'loading...'}</h1>
      <img src={props.data ? props.data.img : null} onClick={writeLocation}></img>
    </div>
  )
}

export default Scene