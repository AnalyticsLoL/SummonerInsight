import React, { useEffect } from 'react';
import {api_url, regions} from '../constants.js';
import { fetchAPIData } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../Context.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '../assets/css/components/SearchSummonerBar.css';

import LoadButton from '../reusable/LoadButton.js';

function RegionDropdown({setRegionTag, regionName, setRegionName, setRegionRoute}){
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef(null);

    const handleDropdownClick = (region) => {
        setDropdownOpen(false);
        setRegionTag(region.regionTag);
        setRegionName(region.regionName);
        setRegionRoute(region.regionRoute);
    };

    useEffect(() => {
        const handleEscPress = (event) => {
            if (event.key === 'Escape') {
                setDropdownOpen(false);
            }
        };
        
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscPress);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleEscPress);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    return (
        <div ref={dropdownRef} id='region_dropdown' onClick={() => setDropdownOpen(!dropdownOpen)} style={{height: dropdownOpen? "300px":""}}>
            <div className='dropdown-header'>
                <span>Region:</span>
                <FontAwesomeIcon icon={dropdownOpen?faChevronUp : faChevronDown} />
                <p className='open_dropdown'>{regionName}</p>
            </div>
            {dropdownOpen && (
                <div className="dropdown-menu">
                    {regions.map((region, index) => (
                        <div key={index} className='dropdown_item' onClick={() => handleDropdownClick(region)}>
                            <region.regionIcon />
                            <p>{region.regionName}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchSummonerBar() {
    const [regionTag, setRegionTag] = React.useState('NA1');
    const [regionName, setRegionName] = React.useState('North America');
    const [gameName, setGameName] = React.useState('');
    const [tagLine, setTagLine] = React.useState('');
    const [regionRoute, setRegionRoute] = React.useState('Americas');
    const { isLoading, setIsLoading } = useGlobal();
    const [message, setMessage] = React.useState('');
    const navigate = useNavigate();

    const HandleGameNameandGameTag=(event)=>{
        const text = event.target.value.split("#");
        setGameName(text[0]);
        setTagLine(text[1]||null);
    }

    const fetchSummonerData = async () => {
        if(gameName === '') return;
        if (isLoading) return;
        const settings = {
            GameName: gameName.toLowerCase().replace(/\s/g, ''),
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase(),
            Region: regionRoute.toLowerCase()
        };
        try {
            const summonerInfo = await fetchAPIData(`${api_url}/summonerInfo`, settings, setIsLoading);
            const matchhistory = await fetchAPIData(`${api_url}/matchhistory?idStartList=0&idCount=20`, settings, setIsLoading);
            if (summonerInfo && matchhistory) {
                navigate(
                    `/summoner/${settings.RegionTag}/${settings.GameName}/${settings.TagLine}`,
                    {
                        state: {
                            summonerInfo: summonerInfo,
                            matchhistory: matchhistory
                        }
                    }
                );
            }
        } catch (error) {
            setMessage('Please enter your tag numbers using the format #0000 or select the right region.');
            setTimeout(() => setMessage(''), 7800); // Reset the message a bit shorter than the animation to avoid rerendering visual error
        } 
    };
    return(
        <div id='search_summoner_bar'>
            <div className='search_summoner_bar_content'>
                <RegionDropdown setRegionTag={setRegionTag} regionName={regionName} setRegionName={setRegionName} setRegionRoute={setRegionRoute}/>
                <div className='vertical_line'/>
                <div className='gameName_input'>
                    <span>Game Name:</span>
                    <textarea 
                        type="text" 
                        onChange={(event)=> HandleGameNameandGameTag(event)} 
                        placeholder={`Game Name + #${regionTag}`}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                        onKeyDown={(event)=>{
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                fetchSummonerData();
                            }
                        }} 
                    />
                </div>
                <LoadButton onClick={fetchSummonerData} text='Search'/>
            </div>
            {message && (
                <div className="message">
                    <div className="message-content">
                        <p><FontAwesomeIcon icon={faInfoCircle} /> {message}</p>
                    </div>
                </div>
            )}
        </div>
    );
}