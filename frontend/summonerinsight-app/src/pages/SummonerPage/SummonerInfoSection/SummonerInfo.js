import React from "react";

import "../../../assets/css/pages/SummonerPage/SummonerInfoSection/SummonerInfo.css";

import MasterySection from "./MasterySection.js";
import RankedSection from "./RankedSection.js";
import ProfileSection from "./ProfileSection.js";
import SummonerStats from "./SummonerStatsSection.js";

export default function SummonerInfo({summonerInfo, matchHistory}){
    return(
        <div>
            <div id="summoner-info">
                <ProfileSection summonerProfile={summonerInfo.summonerProfile} matchHistory={matchHistory}/>
                <RankedSection rankedStats={summonerInfo.rankedStats}/>
                <MasterySection initialMasteries={summonerInfo.championMastery}/>
                <SummonerStats matchHistory={matchHistory}/>
            </div>
        </div>
    );
}