import React, { useEffect } from 'react';
import {regions} from '../constants.js';
import { useNavigate } from 'react-router-dom';
import '../assets/css/components/SearchSummonerBar.css';

function RegionDropdown({setRegionTag, regionName, setRegionName, setRegionRoute}){
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

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
            if (event.target.className !== 'dropdown_button' && event.target.className !== 'open_dropdown') {
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


    return(
        <div className='region_dropdown'>
            <span>Region:</span>
            <button className='open_dropdown' onClick={() => setDropdownOpen(!dropdownOpen)}>{regionName}</button>
            {dropdownOpen && (
                <div className="dropdown-menu">
                    {regions.map((region, index) => (
                        <button key={index} className='dropdown_button' onClick={() => handleDropdownClick(region)}>{region.regionName}</button>
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
    const [isLoading,setIsLoading] = React.useState(false);
    const navigate = useNavigate();

    const HandleGameNameandGameTag=(event)=>{
        const text = event.target.value.split("#");
        setGameName(text[0]);
        setTagLine(text[1]||null);
    }

    const fetchSummonerData = async () => {
        if(!isLoading){
            setIsLoading(true);
            const settings = {
                GameName: gameName,
                RegionTag: regionTag.toLowerCase(),
                TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase(),
                Region: regionRoute.toLowerCase()
            }
            console.log(settings);
            let summonerInfo=null;
            let matchhistory=null;
            let url = `http://127.0.0.1:5151/api/RiotData/summonerInfo`;
            let response = await fetch(url, {
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings)
            });
            if (!response.ok) {
                console.log(settings)
                if (settings.TagLine.toLowerCase()===settings.RegionTag) {
                    console.log('You must enter your tags using the format #0000 or select the right region')
                } else {
                    console.error(`Error: ${response.statusText}`);
                }
            } else {
                summonerInfo = await response.json();
                console.log(summonerInfo);
            }

            url = `http://127.0.0.1:5151/api/RiotData/matchhistory?idStartList=0&idEndList=5`;
            response = await fetch(url, {
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(settings)
            });
            if (!response.ok) {
                console.error(`Error: ${response.statusText}`);
            }
            else {
                matchhistory = await response.json();
                console.log(matchhistory);
            }
            setIsLoading(false);
            if (summonerInfo && matchhistory){
                navigate(
                    `/${settings.RegionTag.replace(/[0-9]/g, '')}/${settings.GameName}/${settings.TagLine}`,
                    {state: {
                        summonerInfo: summonerInfo,
                        matchhistory: matchhistory
                    }}
                );
            }
        }
    };
    return(
        <div id='search_summoner_bar'>
            <RegionDropdown setRegionTag={setRegionTag} regionName={regionName} setRegionName={setRegionName} setRegionRoute={setRegionRoute}/>
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
                            if (gameName !== '') {
                                fetchSummonerData();
                            }
                        }
                    }} 
                />
            </div>
            <button className="search_button" onClick={()=>fetchSummonerData()?gameName!=='':null}>Search</button>
        </div>
    );
}