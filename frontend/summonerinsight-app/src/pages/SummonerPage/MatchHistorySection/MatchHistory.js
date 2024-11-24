import React, { useState } from "react";
import {useParams} from "react-router-dom";

import '../../../assets/css/pages/SummonerPage/MatchHistorySection/MatchHistory.css';

import LoadButton from "../../../reusable/LoadButton.js";
import GameStatus from "./GameStatus.js";
import PlayerInfos from "./PlayerInfos.js";
import Team from "./Team.js";

import {fetchAPIData} from "../../../api.js";
import {api_url} from "../../../constants.js";

function Match({match}){
    const { gameName } = useParams();
    const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);
    return(
        <div className={`match ${playerStats.win ? 'win' : 'loss'}`}>
            <GameStatus playerStats={playerStats} match={match}/>
            <PlayerInfos playerStats={playerStats} match={match}/>
            <div className="team-composition">
                <Team match={match} id={100} gameName={gameName}/>
                <Team match={match} id={200} gameName={gameName}/>
            </div>
        </div>
    );
}

export default function MatchHistory({matchhistory}){
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
        <div id="match-history">
            {matches.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
            {canLoad && (<LoadButton onClick={fetchSummonerData} text='Load More' isFetching={isFetching}/>)}
        </div>
    );
}