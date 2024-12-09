import React, { useRef } from "react";
import { useDispatch } from 'react-redux';

import { setSummonerData } from "../../../redux/summonerSlice.js";
import { fetchAPIData } from "../../../api.js";
import { api_url, regions } from "../../../constants.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useParams } from "react-router-dom";


import "../../../assets/css/pages/SummonerPage/SummonerInfoSection/SummonerInfo.css";

import MasterySection from "./MasterySection.js";
import RankedSection from "./RankedSection.js";
import ProfileSection from "./ProfileSection.js";
import SummonerStats from "./SummonerStatsSection.js";
import LoadButton from "../../../components/LoadButton.js";

export default function SummonerInfo(){
    const { regionTag, gameName, tagLine } = useParams();
    const regionRoute = regions.find(region => region.regionTag.toLowerCase() === regionTag).regionRoute;
    const isFetching = useRef(false);
    const dispatch = useDispatch();

    const fetchSummonerData = async () => {
        if (isFetching.current) return;
        const settings = {
            GameName: gameName.toLowerCase().replace(/\s/g, ''),
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase(),
            Region: regionRoute.toLowerCase()
        };
        try {
            const summonerInfo = await fetchAPIData(`${api_url}/summonerInfo`, settings, isFetching);
            const matchHistory = await fetchAPIData(`${api_url}/matchhistory?idStartList=0&idCount=20`, settings, isFetching);
            if (summonerInfo && matchHistory) {
                if (matchHistory.length === 0) {
                    throw new Error('No match history found in the last year for this summoner.');
                }
                dispatch(setSummonerData(
                    {
                        'summonerInfo':summonerInfo,
                        'matchHistory':matchHistory
                    }
                ));
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    return(
        <div>
            <div id="summoner-info">
                <ProfileSection />
                <LoadButton onClick={fetchSummonerData} text="Refresh" isFetching={isFetching} icon={<FontAwesomeIcon icon={faSearch} />} />
                <RankedSection />
                <MasterySection />
                <SummonerStats />
            </div>
        </div>
    );
}