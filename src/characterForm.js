function CharacterForm(props) {
  console.log(props.coords)
  return(
    <div className="character-form" style={{left: props.coords[0], top: props.coords[1]}}>
      <p>character?</p>
    </div>
  )
}

export default CharacterForm