import React, {useEffect} from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../assets/css/components/NavBar.css';
import SearchSummonerBar from './SearchSummonerBar';

export default function NavBar(){
    const location = useLocation();
    const [hasSearchBar, setHasSearchBar] = React.useState(false);
    useEffect(() => {
        setHasSearchBar(location.pathname !== '/');
    }, [location]);
    return(
        <div id="navbar">
            <div className='content'>
                <Link to='/'>
                    <h3>Home</h3>
                </Link>
                {hasSearchBar && <SearchSummonerBar isSmall={true}/>}
            </div>
        </div>
    );
}