import { Link } from 'react-router-dom';
import '../assets/css/components/NavBar.css';

export default function NavBar(){
    return(
        <div id="navbar">
            <div className='content'>
                <Link to='/'>
                    <h3>Home</h3>
                </Link>
            </div>
        </div>
    );
}