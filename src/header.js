import logo from './imgs/logo.png'
import { Link } from 'react-router-dom';

function Header() {
  return(
    <header>
      <img id='logo' src={logo} />
      <nav>
        <Link to={'/'}>Home</Link>
        <Link to={'/leaderboard'}>Leaderboards</Link>
      </nav>
    </header>
  )
}

export default Header