import React from "react";
import { useParams, useLocation } from 'react-router-dom';
import "../assets/css/pages/Summoner.css";
import {ranks} from "../constants";

function RankedSection({rankedStats, emblems}){
    emblems=ranks.find(rank => rank.tier.toUpperCase() === rankedStats.tier);
    return(
        <div className="ranked-section">
            <div className="ranked-header">
                <span>{rankedStats.queueName==="RANKED_SOLO_5x5"?"Ranked Solo/Duo":"Ranked Flex"}</span>
                <hr />
            </div>
            <div className="ranked-info">
                <figure className="rank-icon">
                    <div className="image-container">
                        <img src={emblems.rankEmbleme} alt="Ranked Icon" />
                    </div>
                    <figcaption>
                        <p>{emblems.tier} {rankedStats.rank}</p>
                        <p>{rankedStats.leaguePoints} LP</p>
                    </figcaption>
                </figure>
                <span>
                    <p>{rankedStats.wins}W {rankedStats.losses}L</p>
                    <p>Winrate: {(rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100}%</p>
                </span>
            </div>
        </div>
    );
}

function SummonerInfo({summonerInfo}){
    return(
        <div className="summoner-info">
            <figure className="profile-icon">
                <div className="image-container">
                    <img src={summonerInfo.summonerProfile.profileIconId} alt="Profile Icon" />
                </div>
                <figcaption>{summonerInfo.summonerProfile.summonerLevel}</figcaption>
            </figure>
            <span>
                <p>{summonerInfo.summonerProfile.gameName}#{summonerInfo.summonerProfile.tagLine.toUpperCase()}</p>
                {summonerInfo.summonerProfile.regionTag && (
                    <p>{summonerInfo.summonerProfile.regionTag.toUpperCase()}</p>
                )}
            </span>
            {summonerInfo.rankedStats.length > 0 && 
                summonerInfo.rankedStats.map((rankedStats, index) => (
                    <RankedSection key={index} rankedStats={rankedStats}/>
                ))
            }
        </div>
    );
}

function Match({match}){
    const { gameName } = useParams();
    const getGameDuration = (gameDuration) => {
        const minutes = Math.floor(gameDuration / 60);
        const seconds = gameDuration % 60;
        return `${minutes}m${seconds}s`;
    }
    const getTimeDifference = (gameStart) => {
        const currentTime = Date.now();
        const differenceMinutes = Math.floor((currentTime - gameStart)/60000);
        if(differenceMinutes < 60){
            return `${differenceMinutes} minutes ago`;
        } else {
            const differenceHours = Math.floor(differenceMinutes/60);
            if(differenceHours < 24){
                return `${differenceHours} hour(s) ago`;
            } else {
                const differenceDay = Math.floor(differenceHours/24);
                return `${differenceDay} day(s) ago`;
            }
        }
    }
    const playerStats = match.participants.find(participant => participant.gameName === gameName);
    console.log(playerStats);
    return(
        <div className={`match ${playerStats.win ? 'win' : 'loss'}`}>
            <div className="gameStatus">
                <p>{match.metadata.gameMode}</p>
                <p>{getTimeDifference(match.metadata.gameStart)}</p>
                <hr/>
                <p>{playerStats.win ? 'Victory' : 'Defeat'}</p>
                <p>{getGameDuration(match.metadata.gameDuration)}</p>
            </div>
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
            <div className="kda">
                <p className="kill_death_assists">{playerStats.kda.kills}/{playerStats.kda.deaths}/{playerStats.kda.assists}</p>
                <p className="ratio">{((playerStats.kda.kills+playerStats.kda.assists)/playerStats.kda.deaths).toFixed(2)}:1 KDA</p>
            </div>
        </div>
    );
}

function MatchHistory({matchhistory}){
    return(
        <div className="match-history">
            {matchhistory.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
        </div>
    );
}

export default function Summoner() {
    const location = useLocation();
    const matchhistory=location.state.matchhistory;
    const summonerInfo=location.state.summonerInfo;

    return (
        <div id="summoner">
            <div className="section">
                <SummonerInfo summonerInfo={summonerInfo}/>
                <MatchHistory matchhistory={matchhistory}/>
            </div>
        </div>
    );
}