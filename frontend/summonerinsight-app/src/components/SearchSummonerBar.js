import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {regions} from '../constants.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import '../assets/css/components/SearchSummonerBar.css';

import LoadButton from './LoadButton.js';
import RegionDropdown from './RegionDropdown.js';
import UserMessage from './UserMessage.js';

function SearchTextArea({regionTag, isSmall, entree, setEntree}) {
    
    const location = useLocation();
    const textAreaFocus = useRef(null);
    const navigate = useNavigate();
    const [ isFocused, setIsFocused ] = useState(false);

    useEffect(() => {
        setEntree('');
        textAreaFocus.current.blur();
    }, [location, setEntree]);

    const handlePressEnter = (event)=>{
        if (event.key === 'Enter') {
            event.preventDefault();
            if (entree==='') return;
            const gameName = entree.split("#")[0].toLowerCase().replace(/\s/g, '');
            const tagLine = entree.split("#")[1] ? entree.split("#")[1] : regionTag.toLowerCase();
            navigate(`/summoner/${regionTag.toLowerCase()}/${gameName}/${tagLine}`)
        }
    };

    return(
        <div className='gameName_input'>
            {!isSmall && <span>Game Name:</span>}
            <textarea 
                ref={textAreaFocus}
                type="text" 
                value={entree}
                onChange={(event)=>setEntree(event.target.value)}
                placeholder={isSmall?null:`Game Name + #${regionTag}`}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                onKeyDown={handlePressEnter}
                onFocus={()=>setIsFocused(true)}
                onBlur={()=>setIsFocused(false)}
            />
            {isFocused && (
                <UserMessage message="Enter your game name followed by your #tagline if you have one" messageType="info"/>
            )}
        </div>
    );
}

export default function SearchSummonerBar({isSmall}) {
    const location = useLocation();
    const [regionTag, setRegionTag] = useState(location.pathname !== '/' ? location.pathname.split('/')[2].toUpperCase() : 'NA1');
    const [entree, setEntree] = useState('');
    const navigate = useNavigate();

    const handleNavigation = () => {
        if (entree==='') return;
        const gameName = entree.split("#")[0].toLowerCase().replace(/\s/g, '');
        const tagLine = entree.split("#")[1] ? entree.split("#")[1] : regionTag.toLowerCase();
        navigate(`/summoner/${regionTag.toLowerCase()}/${gameName}/${tagLine}`)
    }

    return(
        <div className={`${isSmall? 'small': ''} search`}>
            <div className='search-content'>
                <RegionDropdown 
                    setRegionTag={setRegionTag} 
                    intialRegionName={isSmall? null : regions.find(region => region.regionTag === regionTag).regionName} 
                    regionTag={isSmall ? regionTag : null}
                />
                <div className='divider'/>
                <SearchTextArea regionTag={regionTag} isSmall={isSmall} entree={entree} setEntree={setEntree}/>
                <LoadButton 
                    onClick={handleNavigation} 
                    icon={<FontAwesomeIcon icon={faSearch} />} 
                />
            </div>
        </div>
    );
}