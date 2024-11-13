import React, {useState} from "react";
import { useParams, useLocation } from 'react-router-dom';

import "../../assets/css/pages/SummonerPage/Summoner.css";
import { useGlobal } from "../../Context.js";

import {fetchAPIData} from "../../api.js";
import {api_url} from "../../constants.js";

import LoadButton from "../../reusable/LoadButton.js";
import Match from "./components/Match.js";
import SummonerInfo from "./components/SummonerInfo.js";

function MatchHistory({matchhistory}){
    const { regionTag, gameName, tagLine } = useParams();
    const [matches, setMatches] = React.useState(matchhistory);
    const [isFetching, setIsFetching] = useState(false);
    
    const fetchSummonerData = async () => {
        if(isFetching) return;
        const settings = {
            GameName: gameName,
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
        }
        const fetchedMatches = await fetchAPIData(`${api_url}/matchhistory?idStartList=${matches.length}&idCount=10`, settings, setIsFetching);
        setMatches(prevMatches => [...prevMatches, ...fetchedMatches]);
    };
    return(
        <div className="match-history">
            {matches.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
            <LoadButton onClick={fetchSummonerData} text='Load More' isFetching={isFetching}/>
        </div>
    );
}

export default function Summoner() {
    const location = useLocation();
    const { isLoadingGlobal } = useGlobal();
    const matchhistory=location.state.matchhistory;
    const summonerInfo=location.state.summonerInfo;
    return (
        <div id="summoner" className="page" style={{ visibility: isLoadingGlobal ? 'hidden' : 'visible' }}>
            <div className="section">
                <SummonerInfo summonerInfo={summonerInfo} matchHistory={matchhistory}/>
                <MatchHistory matchhistory={matchhistory}/>
            </div>
        </div>
    );
}