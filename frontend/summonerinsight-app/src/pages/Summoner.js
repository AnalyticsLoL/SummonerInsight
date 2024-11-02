import React from "react";
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

import "../assets/css/pages/Summoner.css";
import { useGlobal } from "../Context.js";

import { ranks, championMasteries } from "../constants";
import { getTimeDifference } from "../reusable/UnixTimeConvert.js";
import {fetchData} from "../fetchData";

import LoadButton from "../reusable/LoadButton";
import Match from "../components/Match";

function RankedSection({rankedStats, emblems}){
    const [isClicked, setIsClicked] = React.useState(false);

    emblems=ranks.find(rank => rank.tier.toUpperCase() === rankedStats.tier);
    return(
        <div className={`ranked-element ${isClicked ? "is-expanded" : ""}`}>
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

function MasterySection({championMastery}){
    return(
        <div className="champion-masteries">
            {championMastery.map((mastery, index) => (
                <div key={index} className="champion-mastery">
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
                    <div className="mastery-tooltip">
                        <p>{mastery.championName}</p>
                        <p>Mastery level {mastery.championLevel}</p>
                        <p>{mastery.championPoints.toLocaleString()} Points</p>
                        <p>Last played: {getTimeDifference(mastery.lastPlayTime)}</p>
                        <div className="mastery-grades">
                            <p>Milestone:</p>
                            {mastery.milestoneGrades.map((grade, index) => (
                                <p key={index}>{grade}</p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
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
            <div className="ranked-section">
                {summonerInfo.rankedStats.length > 0 && 
                    summonerInfo.rankedStats.map((rankedStats, index) => (
                        <RankedSection key={index} rankedStats={rankedStats}/>
                    ))
                }
            </div>
            <MasterySection championMastery={summonerInfo.championMastery}/> 
        </div>
    );
}

function MatchHistory({matchhistory}){
    const { regionTag, gameName, tagLine } = useParams();
    const [matches, setMatches] = React.useState(matchhistory);
    const { isLoading, setIsLoading } = useGlobal();
    

    const fetchSummonerData = async () => {
        if(isLoading) return;
        const settings = {
            GameName: gameName,
            RegionTag: regionTag.toLowerCase(),
            TagLine: tagLine !== null ? tagLine : regionTag.toLowerCase()
        }
        console.log(matches.length+1);
        const fetchedMatches = await fetchData(`http://127.0.0.1:5151/api/RiotData/matchhistory?idStartList=${matches.length}&idCount=10`, settings, setIsLoading);
        setMatches(prevMatches => [...prevMatches, ...fetchedMatches]);
    };
    return(
        <div className="match-history">
            {matches.map((match, index) => (
                <Match key={index} match={match}/>
            ))}
            <LoadButton onClick={fetchSummonerData} text='Load More'/>
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