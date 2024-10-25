import React from "react";
import { useParams, useLocation } from 'react-router-dom';
import "../assets/css/pages/MatchHistory.css";
import {ranks} from "../constants";

function SummonerInfo({summonerInfo}){
    const rank = ranks.find(rank=>rank.tier.toUpperCase()===summonerInfo.tier);
    const typeRank = summonerInfo.queueType==="RANKED_SOLO_5x5" ? "Ranked Solo/Duo" : "Ranked Flex";
    return(
        <div className="summoner-info">
            <figure className="profile-icon">
                <div className="image-container">
                    <img src={summonerInfo.profileIconId} alt="Profile Icon" />
                </div>
                <figcaption>{summonerInfo.summonerLevel}</figcaption>
            </figure>
            <span>
                <p>{summonerInfo.gameName}#{summonerInfo.tagLine.toUpperCase()}</p>
                <p>{summonerInfo.regionTag}</p>
            </span>
            {summonerInfo.tier && (
                <div className="ranked-section">
                    <div className="ranked-header">
                        <span>{typeRank}</span>
                        <hr/>
                    </div>
                    <div className="ranked-info">
                        <figure className="rank-icon">
                            <div className="image-container">
                                <img src={rank.rankEmbleme} alt="Ranked Icon" />
                            </div>
                            <figcaption>
                                <p>{rank.tier} {summonerInfo.rank}</p>
                                <p>{summonerInfo.leaguePoints} LP</p>
                            </figcaption>
                        </figure>
                        <span>
                            <p>{summonerInfo.wins}W {summonerInfo.losses}L</p>
                            <p>Winrate: {(summonerInfo.wins/(summonerInfo.wins+summonerInfo.losses))*100}%</p>
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

function Match({match}){
    const getGameDuration = (gameDuration) => {
        const minutes = Math.floor(gameDuration / 60);
        const seconds = gameDuration % 60;
        return `${minutes}m${seconds}`;
    }
    return(
        <div className="match">
            <p>{match.metadata.gameMode}</p>
            <p>{getGameDuration(match.metadata.gameDuration)}</p>
        </div>
    );
}

function Matches({matchhistory}){
    return(
        <div className="match-history">
            {matchhistory.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
        </div>
    );
}

export default function MatchHistory() {
    const { regionTag, summonerName, tagLine } = useParams();
    const location = useLocation();
    const matchhistory=location.state.matchhistory;
    const summonerInfo=location.state.summonerInfo;

    return (
        <div id="match_history">
            <div className="section">
                <SummonerInfo summonerInfo={summonerInfo}/>
                <Matches matchhistory={matchhistory}/>
            </div>
        </div>
    );
}