import React from "react";
import { useParams } from 'react-router-dom';
import "../assets/css/components/Match.css";

import {gameTypes} from "../constants";

function GameStatus({playerStats, match}){
    const getGameDuration = (gameDuration) => {
        const minutes = Math.floor(gameDuration / 60);
        const seconds = gameDuration % 60;
        return `${minutes}m${seconds}s`;
    }
    const getTimeDifference = (gameStart) => {
        const differenceMilliseconds = Date.now() - gameStart;
        const differenceMinutes = Math.floor(differenceMilliseconds / 60000);
        // Define time units and their thresholds
        const timeUnits = [
            { unit: 'year', value: 12 * 30 * 24 * 60 },
            { unit: 'month', value: 30 * 24 * 60 },
            { unit: 'week', value: 7 * 24 * 60 },
            { unit: 'day', value: 24 * 60 },
            { unit: 'hour', value: 60 },
            { unit: 'minute', value: 1 }
        ];
        for (const { unit, value } of timeUnits) {
            if (differenceMinutes >= value) {
                const count = Math.floor(differenceMinutes / value);
                return `${count} ${unit}${count !== 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    };
    return (
        <div className="game-status">
            <p>{gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId)?gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId).description:match.metadata.gameTypeId}</p>
            <p>{getTimeDifference(match.metadata.gameStart)}</p>
            <hr/>
            <p>{playerStats.win ? 'Victory' : 'Defeat'}</p>
            <p>{getGameDuration(match.metadata.gameDuration)}</p>
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
                <figure className="champion-summoner">
                    <img src={playerStats.championIcon} alt="Champion Icon" />
                    <figcaption>{playerStats.champLevel}</figcaption>
                </figure>
                <figure className="items">
                    {playerStats.items.map((item, index) => 
                    item.itemId !== 0 ? (
                        <img key={index} className={`item ${index === playerStats.items.length - 1 ? 'last-item' : ''}`} src={item.itemIcon} alt="Item Icon" />
                    )
                    : (
                        <div key={index} className={`empty item ${index === playerStats.items.length - 1 ? 'last-item' : ''}`}/>
                    )
                    )}
                </figure>
            </div>
            <div className="player-stats">
                <div className="kda">
                    <p className="kill_death_assists">{playerStats.kda.kills}/{playerStats.kda.deaths}/{playerStats.kda.assists}</p>
                    <p className="ratio">{((playerStats.kda.kills+playerStats.kda.assists)/playerStats.kda.deaths).toFixed(2)}:1 KDA</p>
                </div>
                <div className="damage">
                    <div className="damage-section">
                        <p>{playerStats.damage.totalDamageDealtToChampions.toLocaleString()}</p>
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
                        <img src={participant.championIcon} alt="Champion Icon" />
                        <figcaption style={{fontWeight: participant.gameName===gameName?'bold':null}}>{participant.gameName}</figcaption>
                    </figure>
                ))}
        </div>
    );
}

export default function Match({match}){
    const { gameName } = useParams();
    const playerStats = match.participants.find(participant => participant.gameName === gameName);
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