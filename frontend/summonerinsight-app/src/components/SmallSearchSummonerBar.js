import React, { useEffect, useState, useRef } from 'react';
import {api_url, regions} from '../constants.js';
import { fetchAPIData } from '../api.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import '../assets/css/components/SmallSearchSummonerBar.css';

import LoadButton from '../reusable/LoadButton.js';

function RegionDropdown({setRegionTag, regionTag, setRegionRoute}){
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownClick = (region) => {
        setDropdownOpen(false);
        setRegionTag(region.regionTag);
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
        <div ref={dropdownRef} className='region_dropdown' onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className='header'>
                <p>{regionTag.replace(/\d+/g, '')}</p>
                <FontAwesomeIcon icon={dropdownOpen?faChevronUp : faChevronDown} />
            </div>
            {dropdownOpen && (
                <div className="menu">
                    {regions.map((region, index) => (
                        <span key={index} className='item' onClick={() => handleDropdownClick(region)}>
                            <p>{region.regionTag.replace(/\d+/g, '')}</p>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SmallSearchSummonerBar() {
    const [regionTag, setRegionTag] = useState('NA1');
    const [gameName, setGameName] = useState('');
    const [tagLine, setTagLine] = useState('');
    const [regionRoute, setRegionRoute] = useState('Americas');
    const isFetching = useRef(false);
    const navigate = useNavigate();

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
            console.error(error.message);
        } 
    };
    return(
        <div className='small search'>
            <div className='search-content'>
                <RegionDropdown setRegionTag={setRegionTag} regionTag={regionTag} setRegionRoute={setRegionRoute}/>
                <textarea 
                    type="text" 
                    onChange={(event)=> HandleGameNameandGameTag(event)} 
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    onKeyDown={(event)=>{
                        if (event.key === 'Enter') {
                            event.preventDefault();
                            fetchSummonerData();
                            event.target.value = '';
                        }
                    }} 
                />
                <LoadButton onClick={fetchSummonerData} icon={<FontAwesomeIcon icon={faSearch} />} isFetching={isFetching}/>
            </div>
        </div>
    );
}