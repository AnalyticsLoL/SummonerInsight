import React, {useEffect, useRef} from "react";
import { useParams } from 'react-router-dom';

import "../../assets/css/pages/SummonerPage/Summoner.css";

import {fetchAPIData} from "../../api.js";
import {api_url, regions} from "../../constants.js";

import MatchHistory from "./MatchHistorySection/MatchHistory.js";
import SummonerInfo from "./SummonerInfoSection/SummonerInfo.js";
import { useGlobal } from "../../Context.js";

export default function Summoner() {
    const isFetching = useRef(false);
    const { regionTag, gameName, tagLine } = useParams();
    const { summonerInfo, setSummonerInfo, matchHistory, setMatchHistory } = useGlobal();

    useEffect(() => {
        const fetchSummonerData = async () => {
            if(isFetching.current) return;
            const settings = {
                GameName: gameName,
                Region: regions.find(region => region.regionTag.toLowerCase() === regionTag).regionRoute,
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
                    sessionStorage.setItem('summonerData', JSON.stringify(
                        {
                            'summonerInfo':fetchedSummonerInfo,
                            'matchHistory':fetchedMatchHistory
                        }
                    ));
                    setSummonerInfo(fetchedSummonerInfo);
                    setMatchHistory(fetchedMatchHistory);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        // Session storage keeps the data as long as the page isn't closed. getItem returns a string, so it needs to be parsed into Object
        const storedSummonerData = JSON.parse(sessionStorage.getItem('summonerData'));
        const storedSummonerInfo = storedSummonerData['summonerInfo'];
        const storedMatchHistory = storedSummonerData['matchHistory'];

        // Used when setSummonerInfo and setMatchHistory are updated and the page is reloaded
        if (summonerInfo && summonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase()===gameName) {
            return;
        }
        // Used when the page is reloaded or accessed from a search bar
        else if ((storedSummonerInfo && storedSummonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase()===gameName) && storedMatchHistory) {
            setSummonerInfo(storedSummonerInfo);
            setMatchHistory(storedMatchHistory);
        } 
        // Used when the page is loaded for the first time
        else if (storedSummonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase()!==gameName){
            console.log(`Fetching summoner data for ${gameName}#${tagLine}`);
            fetchSummonerData();
        } else {
            console.error('Failed to fetch data');
        }
    }, [regionTag, gameName, tagLine, summonerInfo, matchHistory, setMatchHistory, setSummonerInfo]);

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