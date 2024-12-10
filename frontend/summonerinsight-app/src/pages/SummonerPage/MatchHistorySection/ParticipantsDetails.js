import React from "react";
import { useParams, useNavigate } from 'react-router-dom';

import '../../../assets/css/pages/SummonerPage/MatchHistorySection/ParticipantsDetails.css';

import ChampionComponent from "../components/ChampionComponent";
import FillBar from "../../../components/FillBar";
import { regions } from "../../../constants";
import ItemComponent from "../components/ItemComponent";

function ParticipantDetails({participant, maxDealt, maxTaken, maxHealed}){
    const regionTag = useParams().regionTag;
    const gameName = useParams().gameName;
    const navigate = useNavigate();

    const isSupport = participant.damage.totalHealsOnTeammates>=1000 && participant.position === "UTILITY";

    const seeOtherSummoner = (gameName, tagLine) => {
        if(gameName.split(' ')[1] === 'bot') return;
        // To add the 1 in euw1
        if(regions.find(region => region.regionTag.toLowerCase().replace(/\d/g, '') === tagLine.toLowerCase())) {
            tagLine = regions.find(region => region.regionTag.toLowerCase().replace(/\d/g, '') === tagLine.toLowerCase()).regionTag;
        }
        navigate(`../../../summoner/${regionTag}/${gameName.toLowerCase().replace(/\s/g, '')}/${tagLine.toLowerCase()}`);
    }

    return (
        <tr className={`participant ${participant.win ? 'win' : 'loss'} ${participant.gameName.toLowerCase().replace(/\s/g, '') === gameName ? 'enhance' : ''}`}>
            <td className="player" onClick={() => seeOtherSummoner(participant.gameName, participant.tagLine)}>
                <div className="champion-summoner">
                    <ChampionComponent championId={participant.championId} isTooltip={false} />
                    <figcaption>{participant.champLevel}</figcaption>
                </div>
                <p>{participant.gameName}</p>
                {participant.gameName.split(' ')[1] !== 'bot' && (
                    <div className="tooltip">
                        <p>See this summoner</p>
                    </div>
                )}
            </td>
            <td className="kda">
                <p className="kill_death_assists">{participant.kda.kills}/{participant.kda.deaths}/{participant.kda.assists}</p>
                <p className={`ratio ${participant.kda.kda>=5?'enhance gold':''}`}>{participant.kda.kda.toFixed(2)}</p>
                <div className="tooltip">
                    <p>Kill/Deaths/Assists</p>
                </div>
            </td>
            <td className="damage">
                {isSupport
                    ?(<div className="damage-section">
                        <p className={`${participant.damage.totalHealsOnTeammates>maxHealed*0.75?'enhance gold':''}`}>{participant.damage.totalHealsOnTeammates.toLocaleString()}</p>
                        <FillBar value={participant.damage.totalHealsOnTeammates} maxValue={maxHealed}/>
                        <p>Healed</p>
                        <div className="tooltip">
                            <p>HP healed to Teammates</p>
                        </div>
                    </div>)
                    :(<div className="damage-section">
                        <p className={`${participant.damage.totalDamageDealtToChampions>maxDealt*0.75?'enhance gold':''}`}>{participant.damage.totalDamageDealtToChampions.toLocaleString()}</p>
                        <FillBar value={participant.damage.totalDamageDealtToChampions} maxValue={maxDealt}/>
                        <p>Dealt</p>
                        <div className="tooltip">
                            <p>Damage dealt</p>
                        </div>
                    </div>)
                }
                <div className="damage-section">
                    <p>{participant.damage.totalDamageTaken.toLocaleString()}</p>
                    <FillBar value={participant.damage.totalDamageTaken} maxValue={maxTaken}/>
                    <p>Taken</p>
                    <div className="tooltip">
                        <p>Damage taken</p>
                    </div>
                </div>
            </td>
            <td className="cs">
                <p>{participant.gold.totalMinionsKilled}</p>
                <p>{participant.gold.csPerMinute.toFixed(1)}/m</p>
                <div className="tooltip">
                    <p>Total minions killed</p>
                        <p>Minions killed / minute</p>
                </div>
            </td>
            <td className="vision">
                <p>{participant.vision.controlWardsPlaced ? participant.vision.controlWardsPlaced : 0}</p>
                <p>{participant.vision.wardsPlaced}/{participant.vision.wardsKilled}</p>
                <div className="tooltip">
                    <p>Control Wards Placed</p>
                    <p>Wards placed / Wards destroyed</p>
                </div>
            </td>
            <td className="items">
                {participant.items.map((item, index) => (
                    <ItemComponent key={index} itemId={item} isTooltip={true} />
                ))}
            </td>
        </tr>
    );
}

export default function ParticipantsDetails({ match, maxDealt, maxTaken, maxHealed}){
    const team1 = match.participants.filter(participant => participant.teamId === 100);
    const team2 = match.participants.filter(participant => participant.teamId === 200);



    return (
        <table className="participants-table">
            <thead>
                <tr>
                    <th className="player">
                        <p>Player</p>
                    </th>
                    <th><p>KDA</p></th>
                    <th className="damage"><p>Damage</p></th>
                    <th><p>CS</p></th>
                    <th><p>Vision</p></th>
                    <th className="items"><p>Items</p></th>
                </tr>
            </thead>
            <tbody>
                {team1.map((participant, index) => (
                    <ParticipantDetails key={index} participant={participant} maxDealt={maxDealt} maxTaken={maxTaken} maxHealed={maxHealed} />
                ))}
                <tr className="divider"/>
                {team2.map((participant, index) => (
                    <ParticipantDetails key={index} participant={participant} maxDealt={maxDealt} maxTaken={maxTaken} maxHealed={maxHealed} />
                ))}
            </tbody>
        </table>
    );
}