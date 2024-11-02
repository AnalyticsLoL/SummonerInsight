import React from "react";
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

import "../../../assets/css/pages/SummonerPage/components/SummonerInfo.css";

import { ranks, championMasteries } from "../../../constants.js";
import { getTimeDifference } from "../../../reusable/UnixTimeConvert.js";

function ProfileSection({summonerProfile}){
    return (
        <div className="profile section">
            <figure className="profile-icon">
                <div className="image-container">
                    <img src={summonerProfile.profileIconId} alt="Profile Icon" />
                </div>
                <figcaption>{summonerProfile.summonerLevel}</figcaption>
            </figure>
            <span>
                <p>{summonerProfile.gameName} #{summonerProfile.tagLine.toUpperCase()}</p>
                {summonerProfile.regionTag && (
                    <p>{summonerProfile.regionTag.toUpperCase()}</p>
                )}
            </span>
        </div>
    );
}

function RankedElement({rankedStats, emblems}){
    const [isClicked, setIsClicked] = React.useState(false);

    emblems=ranks.find(rank => rank.tier.toUpperCase() === rankedStats.tier);
    return(
        <div className={`ranked-element  subsection ${isClicked ? "is-expanded" : ""}`}>
            <div className="ranked-header" onClick={()=> setIsClicked(!isClicked)}>
                <span>{rankedStats.queueName==="RANKED_SOLO_5x5"?"Ranked Solo/Duo":"Ranked Flex"}</span>
                <FontAwesomeIcon icon={isClicked?faChevronUp : faChevronDown} />
            </div>
            <hr/>
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
                <div className="ranked-stats">
                    <p>{rankedStats.wins}W {rankedStats.losses}L</p>
                    <p>Winrate: {((rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100).toFixed(2)}%</p>
                </div>
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

function MasterySection({championMastery}){
    return(
        <div className="masteries section">
            {championMastery.map((mastery, index) => (
                <div key={index} className="champion-mastery subsection black-box-hover">
                    <figure>
                        <div className="image-container">
                            <img src={mastery.championIcon} alt="Champion Icon" />
                        </div>
                        <div className="mastery-icon">
                            {mastery.championLevel <= 10 ? (
                                <img src={championMasteries.find(championMastery => championMastery.masteryId === mastery.championLevel).masteryIcon} alt="Mastery Icon" />
                            )
                            :(
                                <img src={championMasteries.find(championMastery => championMastery.masteryId === 10).masteryIcon} alt="Mastery Icon" />
                            )}
                        </div>
                    </figure>
                    <div className="tooltip">
                        <p>{mastery.championName}</p>
                        <p>Mastery level {mastery.championLevel}</p>
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

const countTotalWins = (matches) => {
    matches = matches.filter(match => match.win !== false);
    return matches.length;
}

const getPlayerStats = (matches, gameName) => {
    return matches.map(match => {
        const playerStats = match.participants.find(participant => participant.gameName.toLowerCase().replace(/\s/g, '') === gameName);
        return {
            champion: {
                name: playerStats.championName,
                icon : playerStats.championIcon
            },
            win: playerStats.win,
            kda: playerStats.kda.kda
        };
    });
}

const getMeanKDA = (playerStats) => {
    const totalKda = playerStats.reduce((acc, match) => {
        const { name, icon } = match.champion;
        const { win, kda } = match;

        if (!acc[name]) {
            acc[name] = {
                champion: { name, icon },
                gamesPlayed: 0,
                wins: 0,
                totalKda: 0
            };
        }
        acc[name].gamesPlayed += 1;
        acc[name].wins += win ? 1 : 0;
        acc[name].totalKda += kda;

        return acc;
    }, {});

    console.log(totalKda);
    return Object.values(totalKda).map(champion => ({
        ... champion
        ,meanKda: champion.totalKda / champion.gamesPlayed
    }));
}

function SummonerStats({matchHistory}){
    const { gameName } = useParams();
    const playerStats = getPlayerStats(matchHistory, gameName);
    const totalGames = matchHistory.length;
    const wins = countTotalWins(playerStats);
    const losses = totalGames - wins;
    console.log(playerStats);
    const meanKda = getMeanKDA(playerStats)

    return(
        <div className="stats section">
            <div className="stats subsection black-box-hover">
                <div className="win-loss-ratio">
                    <svg className="winrate-circle" width="110" height="110" viewBox="0 0 36 36">
                        <circle className="bg-circle" cx="18" cy="18" r="16"></circle>
                        <circle className="percent-circle" cx="18" cy="18" r="16"
                                style={{"--percentage": `${wins/totalGames}`}}></circle>
                        <text className={`${wins/totalGames>0.5?'enhance':''}`} x="18" y="20.35" textAnchor="middle" fontSize="8" fill="#333">{(wins/totalGames*100).toFixed(0)}%</text>
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
                            console.log(champion);
                            return (
                                <div key={index} className="champion-kda">
                                    <img src={champion.champion.icon}/>
                                    <div>
                                        <p className={`${champion.wins/champion.gamesPlayed>0.5?'enhance red':''}`}>{(champion.wins/champion.gamesPlayed*100).toFixed(0)}%</p>
                                        <p>({champion.wins}W/{champion.gamesPlayed-champion.wins}L)</p>
                                    </div>
                                    <p className={`${champion.meanKda>5?'enhance gold':''}`}>{champion.meanKda.toFixed(2)} KDA</p>
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
                <ProfileSection summonerProfile={summonerInfo.summonerProfile}/>
                <RankedSection rankedStats={summonerInfo.rankedStats}/>
                <MasterySection championMastery={summonerInfo.championMastery}/>
                <SummonerStats matchHistory={matchHistory}/> 
            </div>
        </div>
    );
}