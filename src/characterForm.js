function CharacterForm(props) {
  return(
    <div className="character-form" style={{left: props.coords[0], top: props.coords[1]}}>
      <div className='top'>
        <p>Character?</p>
        <button onClick={() => props.closeForm()}>X</button>
      </div>
      {props.icons.map((icon) => {
          return (
          <img 
            src={icon.src} 
            className={`icon ${props.finds.includes(icon.name) ? 'found' : ''}`}
            onClick={() => {
              if (!props.finds.includes(icon.name)){
                props.passGuess(icon.name);
              }
            }}
          />)
        })}
    </div>
  )
}

export default CharacterForm