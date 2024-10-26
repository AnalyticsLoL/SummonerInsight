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
    const { summonerName } = useParams();
    const getGameDuration = (gameDuration) => {
        const minutes = Math.floor(gameDuration / 60);
        const seconds = gameDuration % 60;
        return `${minutes}m${seconds}`;
    }
    const playerStats = match.participants.find(participant => participant.summonerName === summonerName);
    console.log(playerStats);
    return(
        <div className="match">
            <p>{match.metadata.gameMode}</p>
            <p>{playerStats.championName}</p>
            <img src={playerStats.championIcon} alt="Champion Icon" />
            <p>{getGameDuration(match.metadata.gameDuration)}</p>
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