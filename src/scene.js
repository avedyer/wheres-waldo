function Scene(props) {
  function registerClick(e) {
    let offsetX = e.target.offsetLeft;
    let offsetY = e.target.offsetTop;
    console.log([e.clientX - offsetX, e.clientY - offsetY]);
  }

  return (
    <div className="scene">
      <h1>{props.title}</h1>
      <img src={props.img} onClick={registerClick}></img>
    </div>
  )
}

export default Scene