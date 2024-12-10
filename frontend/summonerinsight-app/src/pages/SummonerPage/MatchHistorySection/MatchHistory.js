import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import '../../../assets/css/pages/SummonerPage/MatchHistorySection/MatchHistory.css';

import LoadButton from "../../../components/LoadButton.js";
import GameStatus from "./GameStatus.js";
import PlayerInfos from "./PlayerInfos.js";
import Team from "./Team.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

import {fetchAPIData} from "../../../api.js";
import {api_url} from "../../../constants.js";
import { setSummonerData } from "../../../redux/summonerSlice.js";
import ParticipantsDetails from "./ParticipantsDetails.js";

function Match({match}){
    const { gameName } = useParams();
    const [ isOpen, setIsOpen ] = useState(false);
    const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);

    const maxDealt = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalDamageDealtToChampions);
    }, 0);
    const maxTaken = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalDamageTaken);
    }, 0);
    const maxHealed = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalHealsOnTeammates);
    }, 0);

    return(
        <div className='match' onClick={()=>setIsOpen(!isOpen)}>
            <div className={`match-header ${playerStats.win ? 'win' : 'loss'} ${isOpen?'extended':''}`}>
                <GameStatus playerStats={playerStats} match={match}/>
                <PlayerInfos playerStats={playerStats} maxDealt={maxDealt} maxTaken={maxTaken} maxHealed={maxHealed}/>
                <div className="team-composition">
                    <Team match={match} id={100} gameName={gameName}/>
                    <Team match={match} id={200} gameName={gameName}/>
                </div>
                <div className="extend-button">
                    <FontAwesomeIcon icon={isOpen ? faChevronDown: faChevronUp }/>
                </div>
            </div>
            {isOpen && (
                <div className="match-details">
                    <ParticipantsDetails match={match} maxDealt={maxDealt} maxTaken={maxTaken} maxHealed={maxHealed}/>
                </div>
            )}
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