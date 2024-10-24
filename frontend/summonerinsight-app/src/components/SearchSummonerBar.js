import React from 'react';
import {regions} from '../constants.js';

function RegionDropdown({setRegionTag,setRegionRoute}){
    const [dropdownOpen, setDropdownOpen] = React.useState(false);

    const handleDropdownClick = (region) => {
        console.log(`Selected: ${region.regionName}`);
        setDropdownOpen(false);
        setRegionTag(region.regionTag);
        setRegionRoute(region.regionRoute);
    };

    return(
        <div className='region_dropdown'>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>Region</button>
            {dropdownOpen && (
                <ul className="dropdown-menu">
                    {regions.map((region, index) => (
                        <li key={index} onClick={() => handleDropdownClick(region)}>{region.regionName}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default function SearchSummonerBar() {
    const [regionTag, setRegionTag] = React.useState('NA1');
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
            RegionTag: regionTag,
            TagLine: tagLine,
            Region: regionRoute
        }
        let url = `http://127.0.0.1:5151/api/RiotData/matchhistory?idStartList=0&idEndList=5`;
        console.log(JSON.stringify(settings));
        const response = await fetch(url, {
            method:'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify(settings)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        const matchhistory = await response.json();
        console.log(matchhistory);
    };
    return(
        <div id='search_summoner_bar'>
            <RegionDropdown setRegionTag={setRegionTag} setRegionRoute={setRegionRoute}/>
            <input type="text" onChange={(event)=> HandleGameNameandGameTag(event)} placeholder={`Game Name + #${regionTag}`}></input>
            <button onClick={()=>fetchSummonerData()?gameName!=='':null}>Submit</button>
        </div>
    );
}