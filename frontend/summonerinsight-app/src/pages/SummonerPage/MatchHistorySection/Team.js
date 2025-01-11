import React from "react";
import { useParams, useNavigate } from 'react-router-dom';

import '../../../assets/css/pages/SummonerPage/MatchHistorySection/Team.css';

import ChampionComponent from "../components/ChampionComponent"

import { regions } from "../../../constants";

export default function Team({match, id, gameName}){
    const navigate = useNavigate();
    const regionTag = useParams().regionTag;

    const seeOtherSummoner = (gameName, tagLine, e) => {
        if (e.button === 2) return; // Prevent right click
        if(gameName.split(' ')[1] === 'bot') return;
        // To add the 1 in euw1
        if(regions.find(region => region.regionTag.toLowerCase().replace(/\d/g, '') === tagLine.toLowerCase())) {
            tagLine = regions.find(region => region.regionTag.toLowerCase().replace(/\d/g, '') === tagLine.toLowerCase()).regionTag;
        }
        if (e.button === 1) {
            // If middle-click open in new tab
            e.preventDefault(); // Prevent default behavior
            window.open(`../../../summoner/${regionTag}/${gameName.toLowerCase().replace(/\s/g, '')}/${tagLine.toLowerCase()}`, '_blank');
            return;
        }
        navigate(`../../../summoner/${regionTag}/${gameName.toLowerCase().replace(/\s/g, '')}/${tagLine.toLowerCase()}`);
    }

    return (
        <div className="team">
            {match.participants
                .filter(participant => participant.teamId === id)
                .map((participant, index) => (
                    <figure key={index} className="player" onMouseDown={(e) => seeOtherSummoner(participant.gameName, participant.tagLine, e)}>
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