import React from "react";
import { useSelector } from 'react-redux';

import { ranks } from "../../../constants.js";

import "../../../assets/css/pages/SummonerPage/SummonerInfoSection/RankedSection.css";

function RankedElement({rankedStats, emblems}){
    const queueName = rankedStats.queueName==="RANKED_SOLO_5x5"?"Ranked Solo/Duo":"Ranked Flex";
    emblems=ranks.find(rank => rank.tier.toUpperCase() === rankedStats.tier);
    return(
        <div className={`ranked-element  subsection`}>
            <figure className="rank-icon">
                <div className="image-container">
                    <img src={emblems.rankEmbleme} alt="Ranked Icon" />
                </div>
                <span>
                    <h4>{queueName}</h4>
                    <p>{emblems.tier} {rankedStats.rank}</p>
                    <p>{rankedStats.leaguePoints} LP</p>
                </span>
            </figure>
            <div className="tooltip">
                <p>{rankedStats.wins}W {rankedStats.losses}L</p>
                <p>Winrate: {((rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100).toFixed(2)}%</p>
            </div>
        </div>
    );
}

export default function RankedSection(){
    const summonerData = useSelector((state) => state.summoner);
    const rankedStats=summonerData.summonerInfo.rankedStats;

    return(
        <div className="ranked section">
            {rankedStats.length > 0 && 
                rankedStats.map((rankedStat, index) => (
                    <RankedElement key={index} rankedStats={rankedStat}/>
                ))
            }
        </div>
    );
};