This project is a web-based version of Where's Waldo, created as part of The Odin Project curriculum.

  The site pulls data on a number of scenes from firebase and allows the user to identify the location of characters
within each scene. The time required for the player to identify each character is recorded and can be submitted,
along with the user's name, to a firestore database. The leaderboard section of the site will display record times
for every player.

  The core element of the site is the Scene component, which fetches data for a scene with a given id, incluing the
scene's image, which characters can be found, and where. It has two sub-components, CharacterForm, and ScoreForm, 
which allow the user to identify a particular character, submit their score upon finding every character.

  The components of this site are modeled around React components, and rely upon UseState to update and maintain the 
status of a game as the user plays. It is also structured around React's BrowserRouter to navigate the different pages,
as well as dynamically link to Scene pages to maintain flexibility in the event that scenes are added to or removed
from the database.
