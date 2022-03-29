import { useEffect, useState } from 'react';

function ScoreForm(props) {

  //Returns a form for submitting a high score.
  //submitted state variable is used to prevent duplicate submissions
  //Function for sending data to firestore is passed as a prop

  const [name, setName] = useState()
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className='score-form' >
      <h2>Congratulations!</h2>
      <p>You've found every character.</p>
      <input type='text' placeholder='Enter your name' onChange={(e) => setName(e.target.value)}/>
      <button 
        onClick={() => {
          if(!submitted){
            props.enterScore(name);
            setSubmitted(true);
          }
        }}>
          Submit your score
        </button>
      <p className={`success ${submitted ? '' : 'hidden'}`}>Success!</p>
    </div>
  )
}

export default ScoreForm