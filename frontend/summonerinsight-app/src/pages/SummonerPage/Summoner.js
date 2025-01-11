import React, {useState, useEffect, useRef} from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import "../../assets/css/pages/SummonerPage/Summoner.css";
import logo from '../../assets/img/logo/summonerInsightIcon.png';

import {fetchAPIData} from "../../api.js";
import {api_url, regions} from "../../constants.js";

import MatchHistory from "./MatchHistorySection/MatchHistory.js";
import SummonerInfo from "./SummonerInfoSection/SummonerInfo.js";
import { setSummonerData } from "../../redux/summonerSlice.js";
import UserMessage from "../../components/UserMessage.js";

export default function Summoner() {
    const isFetching = useRef(false);
    const apiFetchController = useRef(new AbortController());
    const [ message, setMessage ] = useState(null);
    const { regionTag, gameName, tagLine } = useParams();
    const dispatch = useDispatch();
    const summonerData = useSelector((state) => state.summoner);

    useEffect(() => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'icon';
        linkElement.href = logo;
        document.head.appendChild(linkElement);
        document.title = `${gameName}#${tagLine.toUpperCase()} - Summoner Insight`;
    }, [regionTag, gameName, tagLine]);

    useEffect(() => {
        setMessage(null);
        const fetchSummonerData = async () => {
            const settings = {
                GameName: gameName,
                Region: regions.find(region => region.regionTag.toLowerCase() === regionTag).regionRoute,
                RegionTag: regionTag.toLowerCase(),
                TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
            };
            if (isFetching.current) {
                apiFetchController.current.abort();
            }
            try {
                const fetchedSummonerInfo = await fetchAPIData(`${api_url}/summonerInfo`, settings, isFetching, apiFetchController);
                const fetchedMatchHistory = await fetchAPIData(`${api_url}/matchhistory?idStartList=0&idCount=10`, settings, isFetching, apiFetchController);
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
                setMessage(error.message);
            }
        };
        if (!summonerData.summonerInfo || summonerData.summonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase() !== gameName ||
            summonerData.summonerInfo.summonerProfile.tagLine !== tagLine) {
            console.log(`Fetching summoner data: ${gameName}#${tagLine} from ${regionTag}`);
            fetchSummonerData();
        }
    }, [regionTag, gameName, tagLine, dispatch, summonerData, isFetching]);

    const determineState = () => {
        const isRightSummoner = summonerData.summonerInfo && summonerData.summonerInfo.summonerProfile.gameName.replace(/\s/g, '').toLowerCase() === gameName &&
            summonerData.summonerInfo.summonerProfile.tagLine === tagLine;
        if (message) return "error";
        if (isRightSummoner) return "matched";
        return "loading";
    };  

    const renderContent = () => {
        switch (determineState()) {
            case "loading":
                return (
                    <div className="section">
                        <span className="spinner"></span>
                    </div>
                );
            case "matched":
                return (
                    <div className="section">
                        <SummonerInfo />
                        <MatchHistory />
                    </div>
                );
            case "error":
                return (
                    <div className="section error">
                        <UserMessage message={message} messageType="error"/>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div id="summoner" className="page">
            {renderContent()}
        </div>
    );
}