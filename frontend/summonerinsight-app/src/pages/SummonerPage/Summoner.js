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
    const [isFetching, setIsFetching] = useState(false);
    const { regionTag, gameName, tagLine } = useParams();
    const [summonerInfo, setSummonerInfo] = useState(null);
    const [matchHistory, setMatchHistory] = useState(null);

    useEffect(() => {
        const fetchSummonerData = async () => {
            if (isFetching) return;
            const settings = {
                GameName: gameName,
                RegionTag: regionTag.toLowerCase(),
                TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
            }
            try {
                const fetchedSummonerInfo = await fetchAPIData(`${api_url}/summonerInfo`, settings, setIsFetching);
                const fetchedMatchHistory = await fetchAPIData(`${api_url}/matchhistory?idStartList=0&idCount=20`, settings, setIsFetching);
                if (fetchedSummonerInfo && fetchedMatchHistory) {
                    if (fetchedMatchHistory.length === 0) {
                        throw new Error('No match history found in the last year for this summoner.');
                    }
                    setSummonerInfo(fetchedSummonerInfo);
                    setMatchHistory(fetchedMatchHistory);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        if (location.state) {
            try {
                setSummonerInfo(location.state.summonerInfo);
                setMatchHistory(location.state.matchHistory);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        } else if (!summonerInfo || summonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase()!==gameName) {
            setSummonerInfo(null);
            setMatchHistory(null);
            console.log(`Fetching summoner data for ${gameName}#${tagLine}`);
            fetchSummonerData();
        }        
    }, [regionTag, gameName, tagLine, location.state, summonerInfo, matchHistory]);

    // As long as matchHistory and summonerInfo are not updated, don't render
    if ((!matchHistory && !summonerInfo) || (matchHistory && !matchHistory.every(match => match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName)))) { 
        return(
            <div id="summoner" className="page">
                <div className="section">
                    <span className="spinner"></span>
                </div>
            </div>
        );
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