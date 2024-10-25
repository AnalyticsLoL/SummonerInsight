import React from 'react';
import {regions} from '../constants.js';
import '../assets/css/components/SearchSummonerBar.css';

function RegionDropdown({setRegionTag, regionName, setRegionName, setRegionRoute}){
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleDropdownClick = (region) => {
        console.log(`Selected: ${region.regionName}`);
        setDropdownOpen(false);
        setRegionTag(region.regionTag);
        setRegionName(region.regionName);
        setRegionRoute(region.regionRoute);
    };

    return(
        <div className='region_dropdown'>
            <span>Region:</span>
            <button className='open_dropdown' onClick={() => setDropdownOpen(!dropdownOpen)}>{regionName}</button>
            {dropdownOpen && (
                <div className="dropdown-menu">
                    {regions.map((region, index) => (
                        <button key={index} onClick={() => handleDropdownClick(region)}>{region.regionName}</button>
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

    const HandleGameNameandGameTag=(event)=>{
        const text = event.target.value.split("#");
        setGameName(text[0]);
        setTagLine(text[1]);
    }

    const fetchSummonerData = async () => {
        const settings = {
            SummonerName: gameName,
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine,
            Region: regionRoute.toLowerCase()
        }

        let url = `http://127.0.0.1:5151/api/RiotData/summonerInfo`;
        let response = await fetch(url, {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(settings)
        });
        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
        } else {
            const summonerInfo = await response.json();
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
            const matchhistory = await response.json();
            console.log(matchhistory);
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
                />
            </div>
            <button className="search_button" onClick={()=>fetchSummonerData()?gameName!=='':null}>Search</button>
        </div>
    );
}