import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';


import '../../../assets/css/pages/SummonerPage/MatchHistorySection/MatchHistory.css';

import LoadButton from "../../../components/LoadButton.js";
import GameStatus from "./GameStatus.js";
import PlayerInfos from "./PlayerInfos.js";
import Team from "./Team.js";

import {fetchAPIData} from "../../../api.js";
import {api_url} from "../../../constants.js";
import { setSummonerData } from "../../../redux/summonerSlice.js";

function Match({match}){
    const { gameName } = useParams();
    const [ isOpen, setIsOpen ] = useState(false);

    const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);
    return(
        <div className={`match ${playerStats.win ? 'win' : 'loss'} ${isOpen?'extended':''}`} onClick={()=>setIsOpen(!isOpen)}>
            <GameStatus playerStats={playerStats} match={match}/>
            <PlayerInfos playerStats={playerStats} match={match}/>
            <div className="team-composition section">
                <Team match={match} id={100} gameName={gameName}/>
                <Team match={match} id={200} gameName={gameName}/>
            </div>
        </div>
    );
}

export default function MatchHistory(){
    const { regionTag, gameName, tagLine } = useParams();
    const summonerData = useSelector((state) => state.summoner);
    const dispatch = useDispatch();

    const [matches, setMatches] = useState(summonerData.matchHistory);
    const isFetching = useRef(false);
    const [canLoad, setCanLoad] = useState(true);
    
    const fetchSummonerData = async () => {
        if(isFetching.current) return;
        const settings = {
            GameName: gameName,
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
        }
        const fetchedMatches = await fetchAPIData(`${api_url}/matchhistory?idStartList=${matches.length}&idCount=10`, settings, isFetching);
        if(fetchedMatches.length === 0) setCanLoad(false);

        dispatch(setSummonerData(
            {
                'summonerInfo':summonerData.summonerInfo,
                'matchHistory':[...matches, ...fetchedMatches]
            }
        ));
    };

     // Updates the match list when the matchHistory changes
    useEffect(() => {
        setMatches(summonerData.matchHistory);
    }, [summonerData.matchHistory]);

    return(
        <div id="match-history">
            {matches.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
            {canLoad && (<LoadButton onClick={fetchSummonerData} text='Load More' isFetching={isFetching}/>)}
        </div>
    );
}