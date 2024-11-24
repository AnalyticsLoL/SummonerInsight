import React from "react";

import '../../../assets/css/pages/SummonerPage/MatchHistorySection/PlayerInfos.css';

import ItemComponent from "../components/ItemComponent";
import ChampionComponent from "../components/ChampionComponent";
import FillBar from "../../../reusable/FillBar";

export default function PlayerInfos({playerStats, match}){
    const isSupport = playerStats.damage.totalHealsOnTeammates>=1000 && playerStats.position === "UTILITY";
    const maxDealt = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalDamageDealtToChampions);
    }, 0);
    const maxTaken = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalDamageTaken);
    }, 0);
    const maxHealed = match.participants.reduce((max, player) => {
        return Math.max(max, player.damage.totalHealsOnTeammates);
    }, 0);
    return (
        <div className="player-infos section">
            <div className="player-champion-items">
                <div className="champion-summoner">
                    <ChampionComponent championId={playerStats.championId} isTooltip={true} hasBorder={true}/>
                    <figcaption>{playerStats.champLevel}</figcaption>
                </div>
                <figure className="items">
                    {playerStats.items.map((itemId, index) => 
                    (
                        <ItemComponent key={index} isLastItem={index === playerStats.items.length - 1 ? true : false} itemId={itemId} isTooltip={true}/>
                    ))}
                </figure>
            </div>
            <div className="player-stats">
                <div className="kda">
                    <p className="kill_death_assists">{playerStats.kda.kills}/{playerStats.kda.deaths}/{playerStats.kda.assists}</p>
                    <p className={`ratio ${playerStats.kda.kda>=5?'enhance gold':''}`}>{playerStats.kda.kda.toFixed(2)+" KDA"}</p>
                    <div className="tooltip">
                        <p>Kill/Deaths/Assists</p>
                    </div>
                </div>
                <div className="damage">
                    {isSupport
                        ?(<div className="damage-section">
                            <p className={`${playerStats.damage.totalHealsOnTeammates>maxHealed*0.75?'enhance gold':''}`}>{playerStats.damage.totalHealsOnTeammates.toLocaleString()}</p>
                            <FillBar value={playerStats.damage.totalHealsOnTeammates} maxValue={maxHealed}/>
                            <p>HP Healed</p>
                            <div className="tooltip">
                                <p>HP healed to Teammates</p>
                            </div>
                        </div>)
                        :(<div className="damage-section">
                            <p className={`${playerStats.damage.totalDamageDealtToChampions>maxDealt*0.75?'enhance gold':''}`}>{playerStats.damage.totalDamageDealtToChampions.toLocaleString()}</p>
                            <FillBar value={playerStats.damage.totalDamageDealtToChampions} maxValue={maxDealt}/>
                            <p>Dealt</p>
                            <div className="tooltip">
                                <p>Damage dealt</p>
                            </div>
                        </div>)
                    }
                    <div className="damage-section">
                        <p>{playerStats.damage.totalDamageTaken.toLocaleString()}</p>
                        <FillBar value={playerStats.damage.totalDamageTaken} maxValue={maxTaken}/>
                        <p>Taken</p>
                        <div className="tooltip">
                            <p>Damage taken</p>
                        </div>
                    </div>
                </div>
                <div className="cs">
                    <p>{playerStats.gold.totalMinionsKilled}</p>
                    <p>{playerStats.gold.csPerMinute.toFixed(0)}/m</p>
                    <p>CS</p>
                    <div className="tooltip">
                        <p>Total minions killed</p>
                         <p>Minions killed / minute</p>
                    </div>
                </div>
                <div className="vision">
                    <p>{playerStats.vision.controlWardsPlaced ? playerStats.vision.controlWardsPlaced : 0}</p>
                    <p>{playerStats.vision.wardsPlaced}/{playerStats.vision.wardsKilled}</p>
                    <p>Vision</p>
                    <div className="tooltip">
                        <p>Control Wards Placed</p>
                        <p>Wards placed / Wards destroyed</p>
                    </div>
                </div>
            </div>
        </div>
    );
}