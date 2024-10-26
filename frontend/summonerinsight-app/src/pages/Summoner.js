import React from "react";
import { useParams, useLocation } from 'react-router-dom';

import "../assets/css/pages/Summoner.css";

import {ranks, gameTypes} from "../constants";
import {fetchData} from "../fetchData";

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
                <div className="ranked-stats">
                    <p>{rankedStats.wins}W {rankedStats.losses}L</p>
                    <p>Winrate: {((rankedStats.wins / (rankedStats.wins + rankedStats.losses)) * 100).toFixed(2)}%</p>
                </div>
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
    console.log(match);
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
    console.log(match);
    console.log(gameName);
    const playerStats = match.participants.find(participant => participant.gameName === gameName);
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
    return(
        <div className={`match ${playerStats.win ? 'win' : 'loss'}`}>
            <div className="game-status">
                <p>{gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId)?gameTypes.find(gameType => gameType.queueId === match.metadata.gameTypeId).description:match.metadata.gameTypeId}</p>
                <p>{getTimeDifference(match.metadata.gameStart)}</p>
                <hr/>
                <p>{playerStats.win ? 'Victory' : 'Defeat'}</p>
                <p>{getGameDuration(match.metadata.gameDuration)}</p>
            </div>
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
            <div className="team-composition">
                <div className="team">
                    {match.participants
                        .filter(participant => participant.teamId === 100)
                        .map((participant, index) => (
                            <figure key={index} className="player">
                                <img src={participant.championIcon} alt="Champion Icon" />
                                <figcaption style={{fontWeight: participant.gameName===gameName?'bold':null}}>{participant.gameName}</figcaption>
                            </figure>
                        ))}
                </div>
                <div className="team">
                    {match.participants
                        .filter(participant => participant.teamId === 200)
                        .map((participant, index) => (
                            <figure key={index} className="player">
                                <img src={participant.championIcon} alt="Champion Icon" />
                                <figcaption style={{fontWeight: participant.gameName===gameName?'bold':null}}>{participant.gameName}</figcaption>
                            </figure>
                        ))}
                </div>
            </div>
        </div>
    );
}

function MatchHistory({matchhistory}){
    const { regionTag, gameName, tagLine } = useParams();
    const [isLoading, setIsLoading] = React.useState(false);
    const [matches, setMatches] = React.useState(matchhistory);
    const fetchSummonerData = async () => {
        if(isLoading) return;
        const settings = {
            GameName: gameName,
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
        }
        setIsLoading(true);
        console.log(matches.length+1);
        const fetchedMatches = await fetchData(`http://127.0.0.1:5151/api/RiotData/matchhistory?idStartList=${matches.length}&idCount=5`, settings);
        setMatches(prevMatches => [...prevMatches, ...fetchedMatches]);
        setIsLoading(false);
    };
    return(
        <div className="match-history">
            {matches.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
            <div className="load-more">
                <span className={isLoading? 'loading':''} onClick={fetchSummonerData}>
                    <p>Load More</p>
                </span>
            </div>
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