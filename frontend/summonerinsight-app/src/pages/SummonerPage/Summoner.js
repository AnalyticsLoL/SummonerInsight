import React, {useEffect, useRef} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import "../../assets/css/pages/SummonerPage/Summoner.css";

import {fetchAPIData} from "../../api.js";
import {api_url, regions} from "../../constants.js";

import MatchHistory from "./MatchHistorySection/MatchHistory.js";
import SummonerInfo from "./SummonerInfoSection/SummonerInfo.js";
import { setSummonerData } from "../../redux/summonerSlice.js";

export default function Summoner() {
    const isFetching = useRef(false);
    const { regionTag, gameName, tagLine } = useParams();
    const dispatch = useDispatch();
    const summonerData = useSelector((state) => state.summoner);

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
                    dispatch(setSummonerData(
                        {
                            'summonerInfo':fetchedSummonerInfo,
                            'matchHistory':fetchedMatchHistory
                        }
                    ));

                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        if (!summonerData.summonerInfo || summonerData.summonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase() !== gameName) {
            console.log(`Fetching summoner data: ${gameName}#${tagLine} from ${regionTag}`);
            fetchSummonerData();
        }
    }, [regionTag, gameName, tagLine, dispatch, summonerData]);

    return (
        <div id="summoner" className="page">
            {summonerData.summonerInfo && summonerData.summonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase() === gameName ? (
                <div className="section">
                        <SummonerInfo summonerInfo={summonerData.summonerInfo} matchHistory={summonerData.matchHistory}/>
                        <MatchHistory matchhistory={summonerData.matchHistory}/>
                </div>
            ) : (
                <div className="section">
                    <span className="spinner"></span>
                </div>
            )}
        </div>
    );
}