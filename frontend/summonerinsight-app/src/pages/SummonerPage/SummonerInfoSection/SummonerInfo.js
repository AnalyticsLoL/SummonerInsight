import React from "react";
import { useParams } from 'react-router-dom';

import "../../../assets/css/pages/SummonerPage/SummonerInfoSection/SummonerInfo.css";

import { regions, positions, profileIconPath } from "../../../constants.js";
import { getPlayerStats, countTotalWins, getMeanKDA } from "../components/StatsComputations.js";
import ChampionComponent from "../components/ChampionComponent.js";
import MasterySection from "./MasterySection.js";
import RankedSection from "./RankedSection.js";

function ProfileSection({ summonerProfile,matchHistory }){
    const { regionTag } = useParams();

    const find_positions = (matchHistory, summonerProfile) => {
        let positions = {
            "TOP": 0,
            "JUNGLE": 0,
            "MIDDLE": 0,
            "BOTTOM": 0,
            "UTILITY": 0
        };
        matchHistory.forEach(match => {
            const position = match.participants.find(participant => participant.gameName === summonerProfile.gameName).position;
            positions[position]++;
        });
        return Object.entries(positions).filter(([, value]) => value > 0).sort(([, valueA], [, valueB]) => valueB - valueA).slice(0, 2);
    };

    const favorite_positions = find_positions(matchHistory, summonerProfile);
    const RegionSVG = regions.find(region => region.regionTag === regionTag.toUpperCase()).regionIcon;
    return (
        <div className="profile section">
            <figure className="profile-icon">
                <div className="image-container">
                    {/* In case the profileIconId don't have an image yet in ddragon db, replace with default icon 29*/}
                    <img src={`${profileIconPath}/${summonerProfile.profileIconId}.png`} alt="Profile Icon" onError={(e)=> {e.target.src = `${profileIconPath}/29.png`;}}/> 
                </div>
                <figcaption>{summonerProfile.summonerLevel}</figcaption>
            </figure>
            <span>
                {favorite_positions.length !== 0 && (
                    <div className="position-icons">
                        {favorite_positions.map(([position_API_Name, value]) => {
                            const position = positions.find(pos => pos.API_name === position_API_Name);
                            const PositionIcon = position.positionIcon;
                            return (
                                <div key={position_API_Name} className="position icon">
                                    <PositionIcon />
                                    <div className="tooltip">
                                        <div className="header">
                                            <PositionIcon />
                                            <h4>{position.positionName}</h4>
                                        </div>
                                        <p>{value} games played recently</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <p>{summonerProfile.gameName}{summonerProfile.tagLine !== regionTag ? `#${summonerProfile.tagLine}`:null}</p>
                <div className="region icon">
                    <RegionSVG style={{width: '30px', height: 'auto'}}/>
                    <div className="tooltip">
                        <p>{regions.find(region => region.regionTag === regionTag.toUpperCase()).regionName}</p>
                    </div>
                </div>
            </span>
        </div>
    );
}

function SummonerStats({matchHistory}){
    const { gameName } = useParams();

    const playerStats = getPlayerStats(matchHistory, gameName);
    const totalGames = matchHistory.length;
    const wins = countTotalWins(playerStats);
    const losses = totalGames - wins;
    const meanKda = getMeanKDA(playerStats);

    return(
        <div className="stats section">
            <div className="stats subsection black-box-hover">
                <div className="win-loss-ratio">
                    <svg className="winrate-circle" width="110" height="110" viewBox="0 0 36 36">
                        <circle className="bg-circle" cx="18" cy="18" r="16"></circle>
                        <circle className="percent-circle" cx="18" cy="18" r="16"
                                style={{"--percentage": `${wins/totalGames}`}}></circle>
                        <text className={`${wins/totalGames>0.65?'enhance':''}`} x="18" y="20.35" textAnchor="middle" fontSize="8" fill="#E0E0E0">{(wins/totalGames*100).toFixed(0)}%</text>
                    </svg>
                    <div className="tooltip">
                        <p>{totalGames}G {wins}W {losses}L</p>
                        <p>Winrate: {((wins / totalGames) * 100).toFixed(0)}%</p>
                    </div>
                </div>
                <div className="best-champion-kda">
                    <p>Recent {totalGames} games played champion:</p>
                    {Object.values(meanKda)
                        .sort((a, b) => b.wins - a.wins)
                        .slice(0, 3)
                        .map((champion, index) => {
                            return (
                                <div key={index} className="champion-kda">
                                    <ChampionComponent championId={champion.championId} isTooltip={false}/>
                                    <div>
                                        <p className={`${champion.wins/champion.gamesPlayed>0.65?'enhance red':''}`}>{(champion.wins/champion.gamesPlayed*100).toFixed(0)}%</p>
                                        <p>({champion.wins}W/{champion.gamesPlayed-champion.wins}L)</p>
                                    </div>
                                    <p className={`${champion.meanKda>=5?'enhance gold':''}`}>{champion.meanKda.toFixed(2)} KDA</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default function SummonerInfo({summonerInfo, matchHistory}){
    return(
        <div>
            <div id="summoner-info">
                <ProfileSection summonerProfile={summonerInfo.summonerProfile} matchHistory={matchHistory}/>
                <RankedSection rankedStats={summonerInfo.rankedStats}/>
                <MasterySection initialMasteries={summonerInfo.championMastery}/>
                <SummonerStats matchHistory={matchHistory}/>
            </div>
        </div>
    );
}