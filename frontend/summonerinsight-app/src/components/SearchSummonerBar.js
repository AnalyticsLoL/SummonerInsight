import React, { useState, useRef, useEffect } from 'react';
import {api_url, regions} from '../constants.js';
import { fetchAPIData } from '../api.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import '../assets/css/components/SearchSummonerBar.css';

import LoadButton from './LoadButton.js';
import RegionDropdown from './RegionDropdown.js';

export default function SearchSummonerBar({isSmall}) {
    const location = useLocation();
    const [regionTag, setRegionTag] = useState(location.pathname !== '/' ? location.pathname.split('/')[2].toUpperCase() : 'NA1');
    const [gameName, setGameName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [regionRoute, setRegionRoute] = useState(regions.find(region => region.regionTag === regionTag).regionRoute);
    const [entree, setEntree] = useState('');
    const isFetching= useRef(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const textAreaFocus = useRef(null);

    useEffect(() => {
        setEntree('');
        setGameName('');
        setTagLine('');
        textAreaFocus.current.blur();
    }, [location]);

    const HandleGameNameandGameTag=(event)=>{
        const text = event.target.value.split("#");
        setGameName(text[0]);
        setTagLine(text[1]||null);
    }

    const fetchSummonerData = async () => {
        if(gameName === '') return;
        if (isFetching.current) return;
        const settings = {
            GameName: gameName.toLowerCase().replace(/\s/g, ''),
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase(),
            Region: regionRoute.toLowerCase()
        };
        try {
            const summonerInfo = await fetchAPIData(`${api_url}/summonerInfo`, settings, isFetching);
            const matchHistory = await fetchAPIData(`${api_url}/matchhistory?idStartList=0&idCount=20`, settings, isFetching);
            if (summonerInfo && matchHistory) {
                if (matchHistory.length === 0) {
                    throw new Error('No match history found in the last year for this summoner.');
                }
                navigate(
                    `/summoner/${settings.RegionTag}/${settings.GameName}/${settings.TagLine}`,
                    {
                        state: {
                            summonerInfo: summonerInfo,
                            matchHistory: matchHistory
                        }
                    }
                );
            }
        } catch (error) {
            setMessage(error.message);
            setTimeout(() => setMessage(''), 7800); // Reset the message a bit shorter than the animation to avoid rerendering visual error
        } 
    };
    return(
        <div className={`${isSmall? 'small': ''} search`}>
            <div className='search-content'>
                <RegionDropdown 
                    setRegionTag={setRegionTag} 
                    intialRegionName={isSmall? null : regions.find(region => region.regionTag === regionTag).regionName} 
                    regionTag={isSmall ? regionTag : null}
                    setRegionRoute={setRegionRoute}
                />
                <div className='divider'/>
                <div className='gameName_input'>
                    {!isSmall && <span>Game Name:</span>}
                    <textarea 
                        ref={textAreaFocus}
                        type="text" 
                        value={entree}
                        onChange={(event)=> {
                                setEntree(event.target.value);
                                HandleGameNameandGameTag(event);
                            }
                        } 
                        placeholder={isSmall?null:`Game Name + #${regionTag}`}
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
                <LoadButton onClick={fetchSummonerData} icon={<FontAwesomeIcon icon={faSearch} />} isFetching={isFetching}/>
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