import React from "react";
import { useParams } from 'react-router-dom';
import "../../../assets/css/pages/SummonerPage/components/Match.css";

import {gameTypes} from "../../../constants";
import {getTimeDifference, getDuration} from "../../../reusable/UnixTimeConvert";
import ChampionComponent from "./ChampionComponent"
import ItemComponent from "./ItemComponent";

function GameStatus({playerStats, match}){
    return (
        <div className="game-status">
            <p>{gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId)?gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId).description:match.metadata.gameTypeId}</p>
            <p>{getTimeDifference(match.metadata.gameStart)}</p>
            <hr/>
            <p>{playerStats.win ? 'Victory' : 'Defeat'}</p>
            <p>{getDuration(match.metadata.gameDuration)}</p>
        </div>
    );
}

function PlayerInfos({playerStats, match}){
    const maxDealt = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalDamageDealtToChampions);
    }, 0);
    const maxTaken = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalDamageTaken);
    }, 0);
    const damageFillBar = (damage, maxDamage) => {
        const damagePercentage = (damage/maxDamage)*100;
        return `${damagePercentage}%`;
    }
    return (
        <div className="player-infos">
            <div className="player-champion-items">
                <div className="champion-summoner">
                    <ChampionComponent champion={playerStats.champion} isTooltip={true}/>
                    <figcaption>{playerStats.champLevel}</figcaption>
                </div>
                <figure className="items">
                    {playerStats.items.map((item, index) => 
                    (
                        <ItemComponent isLastItem={index === playerStats.items.length - 1? true : false} item={item} isTooltip={true}/>
                    ))}
                    {playerStats.items.length < 7 &&
                    Array.from({ length: 7 - playerStats.items.length }).map((_, i) => (
                        <div key={i} className={`empty item ${i === 6 ? 'last-item' : ''}`}/>
                    ))}
                </figure>
            </div>
            <div className="player-stats">
                <div className="kda">
                    <p className="kill_death_assists">{playerStats.kda.kills}/{playerStats.kda.deaths}/{playerStats.kda.assists}</p>
                    <p className={`ratio ${playerStats.kda.kda>5?'enhance gold':''}`}>{playerStats.kda.kda.toFixed(2)+" KDA"}</p>
                </div>
                <div className="damage">
                    <div className="damage-section">
                        <p className={`${playerStats.damage.totalDamageDealtToChampions>maxDealt*0.75?'enhance gold':''}`}>{playerStats.damage.totalDamageDealtToChampions.toLocaleString()}</p>
                        <div className="progress">
                            <div className="fill" style={{width: damageFillBar(playerStats.damage.totalDamageDealtToChampions, maxDealt)}}/>
                        </div>
                        <p>Dealt</p>
                    </div>
                    <div className="damage-section">
                        <p>{playerStats.damage.totalDamageTaken.toLocaleString()}</p>
                        <div className="progress">
                            <div className="fill" style={{width: damageFillBar(playerStats.damage.totalDamageTaken, maxTaken)}}/>
                        </div>
                        <p>Taken</p>
                    </div>
                </div>
                <div className="cs">
                    <p>{playerStats.gold.totalMinionsKilled}</p>
                    <p>{playerStats.gold.csPerMinute.toFixed(0)}/m</p>
                    <p>CS</p>
                </div>
                <div className="vision">
                    <p>{playerStats.vision.controlWardsPlaced ? playerStats.vision.controlWardsPlaced : 0}</p>
                    <p>{playerStats.vision.wardsPlaced}/{playerStats.vision.wardsKilled}</p>
                    <p>Vision</p>
                </div>
            </div>
        </div>
    );
}

function Team({match, id, gameName}){
    return (
        <div className="team">
            {match.participants
                .filter(participant => participant.teamId === id)
                .map((participant, index) => (
                    <figure key={index} className="player">
                        <ChampionComponent champion={participant.champion} isTooltip={false}/>
                        <figcaption style={{fontWeight: participant.gameName.toLowerCase().replace(/\s/g, '')===gameName?'bold':null}}>{participant.gameName}</figcaption>
                    </figure>
                ))}
        </div>
    );
}

export default function Match({match}){
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