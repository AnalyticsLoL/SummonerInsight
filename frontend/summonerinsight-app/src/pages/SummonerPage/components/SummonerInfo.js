import React from "react";
import { useParams } from 'react-router-dom';

import "../../../assets/css/pages/SummonerPage/components/SummonerInfo.css";

import { ranks, championMasteriesIcons, regions, positions, championIconPath, profileIconPath, championFullData } from "../../../constants.js";
import { getTimeDifference } from "../../../reusable/UnixTimeConvert.js";
import { find_positions } from "./reusableFunctions";
import { getPlayerStats, countTotalWins, getMeanKDA } from "./StatsComputations";
import ChampionComponent from "./ChampionComponent.js";

function ProfileSection({ summonerProfile,matchHistory }){
    const { regionTag } = useParams();
    const favorite_positions = find_positions(matchHistory, summonerProfile);
    return (
        <div className="profile section">
            <figure className="profile-icon">
                <div className="image-container">
                    <img src={`${profileIconPath}/${summonerProfile.profileIconId}.png`} alt="Profile Icon" />
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
                <p>{regions.find(region => region.regionTag === regionTag.toUpperCase()).regionName}</p>
            </span>
        </div>
    );
}

function RankedElement({rankedStats, emblems}){
    const queueName = rankedStats.queueName==="RANKED_SOLO_5x5"?"Ranked Solo/Duo":"Ranked Flex";
    emblems=ranks.find(rank => rank.tier.toUpperCase() === rankedStats.tier);
    return(
        <div className={`ranked-element  subsection`}>
            <figure className="rank-icon">
                <div className="image-container">
                    <img src={emblems.rankEmbleme} alt="Ranked Icon" />
                </div>
                <span>
                    <h4>{queueName}</h4>
                    <p>{emblems.tier} {rankedStats.rank}</p>
                    <p>{rankedStats.leaguePoints} LP</p>
                </span>
            </figure>
            <div className="tooltip">
                <p>{rankedStats.wins}W {rankedStats.losses}L</p>
                <p>Winrate: {((rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100).toFixed(2)}%</p>
            </div>
        </div>
    );
}

function RankedSection({rankedStats}){
    return(
        <div className="ranked section">
            {rankedStats.length > 0 && 
                rankedStats.map((rankedStat, index) => (
                    <RankedElement key={index} rankedStats={rankedStat}/>
                ))
            }
        </div>
    );
}

function MasterySection({initialMasteries}){
    const championMasteries = initialMasteries.map(mastery => {
        const champion = Object.values(championFullData.data).find(champion => champion.key === mastery.championId.toString());
        return { ...mastery, champion };
    });
    return(
        <div className="masteries section">
            {championMasteries.map((mastery, index) => (
                <div key={index} className="champion-mastery subsection black-box-hover">
                    <figure>
                        <div className="image-container">
                            <img src={`${championIconPath}/${mastery.champion.image.full}`} alt="Champion Icon" />
                        </div>
                        <div className="mastery-icon">
                            {mastery.championLevel <= 10 ? (
                                <img src={championMasteriesIcons.find(championMasteryIcon => championMasteryIcon.masteryId === mastery.championLevel).masteryIcon} alt="Mastery Icon" />
                            )
                            :(
                                <img src={championMasteriesIcons.find(championMasteryIcon => championMasteryIcon.masteryId === 10).masteryIcon} alt="Mastery Icon" />
                            )}
                        </div>
                    </figure>
                    <div className="tooltip">
                        <div className="header">
                            <img src={`${championIconPath}/${mastery.champion.image.full}`} alt="Champion Icon"/>
                            <p>Mastery level {mastery.championLevel}</p>
                        </div>
                        <p>{mastery.championPoints.toLocaleString()} Points</p>
                        <p>Last played: {getTimeDifference(mastery.lastPlayTime)}</p>
                        {mastery.milestoneGrades && <div className="mastery-grades">
                            <p>Milestone:</p>
                            {mastery.milestoneGrades.map((grade, index) => (
                                <p key={index}>{grade}</p>
                            ))}
                        </div>}
                    </div>
                </div>
            ))}
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