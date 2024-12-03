import React, {useEffect, useRef, useState} from "react";
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import "../../assets/css/pages/SummonerPage/Summoner.css";

import {fetchAPIData} from "../../api.js";
import {api_url} from "../../constants.js";

import MatchHistory from "./MatchHistorySection/MatchHistory.js";
import SummonerInfo from "./SummonerInfoSection/SummonerInfo.js";

export default function Summoner() {
    const navigate = useNavigate();
    const location = useLocation();
    const isFetching = useRef(false);
    const { regionTag, gameName, tagLine } = useParams();
    const [summonerInfo, setSummonerInfo] = useState(null);
    const [matchHistory, setMatchHistory] = useState(null);

    useEffect(() => {
        const fetchSummonerData = async () => {
            if(isFetching.current) return;
            setSummonerInfo(null);
            setMatchHistory(null);
            const settings = {
                GameName: gameName,
                RegionTag: regionTag.toLowerCase(),
                TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
            }
            try {
                const fetchedSummonerInfo = await fetchAPIData(`${api_url}/summonerInfo`, settings, isFetching);
                const fetchedMatchHistory = await fetchAPIData(`${api_url}/matchhistory?idStartList=0&idCount=20`, settings, isFetching);
                if (fetchedSummonerInfo && fetchedMatchHistory) {
                    if (fetchedMatchHistory.length === 0) {
                        throw new Error('No match history found in the last year for this summoner.');
                    }

                    // Adds the fetched data to the location state so that on reload the data is not lost
                    console.log('Saved data to location state');
                    navigate(".", {state: {summonerInfo: fetchedSummonerInfo, matchHistory: fetchedMatchHistory}});
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
            console.log(`Fetching summoner data for ${gameName}#${tagLine}`);
            fetchSummonerData();
        }        
    }, [regionTag, gameName, tagLine, location.state, summonerInfo, matchHistory, navigate]);

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