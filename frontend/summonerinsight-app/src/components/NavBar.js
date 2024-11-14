import React, {useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../assets/css/components/NavBar.css';
import SmallSearchSummonerBar from './SmallSearchSummonerBar';

export default function NavBar(){
    const location = useLocation();
    const [hasSearchBar, setHasSearchBar] = React.useState(false);
    useEffect(() => {
        if(location.pathname === '/'){
            setHasSearchBar(false);
        } else {
            setHasSearchBar(true);
        }
    }, [location]);
    return(
        <div id="navbar">
            <div className='content'>
                <Link to='/'>
                    <h3>Home</h3>
                </Link>
                {hasSearchBar && <SmallSearchSummonerBar />}
            </div>
        </div>
    );
}