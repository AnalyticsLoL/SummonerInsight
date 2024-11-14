import React, {useEffect, useState} from "react";
import { useParams, useLocation } from 'react-router-dom';

import "../../assets/css/pages/SummonerPage/Summoner.css";

import {fetchAPIData} from "../../api.js";
import {api_url} from "../../constants.js";

import LoadButton from "../../reusable/LoadButton.js";
import Match from "./components/Match.js";
import SummonerInfo from "./components/SummonerInfo.js";

function MatchHistory({matchhistory}){
    const { regionTag, gameName, tagLine } = useParams();
    const [matches, setMatches] = React.useState(matchhistory);
    const [isFetching, setIsFetching] = useState(false);
    const [canLoad, setCanLoad] = useState(true);
    
    const fetchSummonerData = async () => {
        if(isFetching) return;
        const settings = {
            GameName: gameName,
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
        }
        const fetchedMatches = await fetchAPIData(`${api_url}/matchhistory?idStartList=${matches.length}&idCount=10`, settings, setIsFetching);
        if(fetchedMatches.length === 0) setCanLoad(false);
        setMatches(prevMatches => [...prevMatches, ...fetchedMatches]);
    };
    return(
        <div className="match-history">
            {matches.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
            {canLoad && (<LoadButton onClick={fetchSummonerData} text='Load More' isFetching={isFetching}/>)}
        </div>
    );
}

export default function Summoner() {
    const location = useLocation();
    const { regionTag, gameName, tagLine } = useParams();
    const [summonerInfo, setSummonerInfo] = useState(null);
    const [matchHistory, setMatchHistory] = useState(null);

    useEffect(() => {
        const updateData = () => {
            try {
                setSummonerInfo(location.state.summonerInfo);
                setMatchHistory(location.state.matchHistory);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        updateData();
    }, [regionTag, gameName, tagLine, location.state]);

    // As long as matchHistory and summonerInfo are not updated, don't render
    if (matchHistory!==location.state.matchHistory || summonerInfo!==location.state.summonerInfo){ 
        return;
    };

    return (
        <div id="summoner" className="page">
            <div className="section">
                <SummonerInfo summonerInfo={summonerInfo} matchHistory={matchHistory}/>
                <MatchHistory matchhistory={matchHistory}/>
            </div>
        </div>
    );
}