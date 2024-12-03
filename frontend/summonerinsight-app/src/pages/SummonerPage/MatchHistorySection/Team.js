import React from "react";
import { useParams, useNavigate } from 'react-router-dom';

import '../../../assets/css/pages/SummonerPage/MatchHistorySection/Team.css';

import ChampionComponent from "../components/ChampionComponent"

export default function Team({match, id, gameName}){
    const navigate = useNavigate();
    const regionTag = useParams().regionTag;

    const seeOtherSummoner = (gameName, tagLine) => {
        if(gameName.split(' ')[1] === 'bot') return;
        console.log(gameName);
        navigate(`../../../summoner/${regionTag}/${gameName.toLowerCase().replace(/\s/g, '')}/${tagLine}`);
    }

    return (
        <div className="team">
            {match.participants
                .filter(participant => participant.teamId === id)
                .map((participant, index) => (
                    <figure key={index} className="player" onClick={() => seeOtherSummoner(participant.gameName, participant.tagLine)}>
                        <ChampionComponent championId={participant.championId} isTooltip={false} hasBorder={true}/>
                        <figcaption style={{fontWeight: participant.gameName.toLowerCase().replace(/\s/g, '')===gameName?'bold':null}}>{participant.gameName}</figcaption>
                        {participant.gameName.split(' ')[1] !== 'bot' && (
                            <div className="tooltip">
                                <p>See this summoner</p>
                            </div>
                        )}
                    </figure>
                ))}
        </div>
    );
}