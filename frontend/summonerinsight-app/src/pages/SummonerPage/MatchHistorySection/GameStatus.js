import React from "react";

import '../../../assets/css/pages/SummonerPage/MatchHistorySection/GameStatus.css';

import {gameTypes,positions} from "../../../constants";
import {getTimeDifference} from "../../../reusable/UnixTimeConvert";

export default function GameStatus({playerStats, match}){
    let PositionIcon = null;
    if (playerStats.position !== ''){
        const position = positions.find(pos => pos.API_name === playerStats.position);
        PositionIcon = position.positionIcon;
    }
    return (
        <div className="game-status section">
            { PositionIcon && (<PositionIcon/>)}
            <p>{gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId)?gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId).description:match.metadata.gameTypeId}</p>
            <p>{getTimeDifference(match.metadata.gameStart)}</p>
        </div>
    );
}