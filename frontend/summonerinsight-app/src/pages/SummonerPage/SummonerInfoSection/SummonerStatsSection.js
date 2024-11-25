import React from "react";
import { useParams } from 'react-router-dom';

import "../../../assets/css/pages/SummonerPage/SummonerInfoSection/SummonerStatsSection.css";

import ChampionComponent from "../components/ChampionComponent";
import { getChampionsKDA, getNumberofWins } from "../components/StatsComputations";
import WinrateCircle from "../../../components/WinrateCircle";

export default function SummonerStats({matchHistory}){
    const { gameName } = useParams();

    const totalGames = matchHistory.length;
    const wins = getNumberofWins(matchHistory, gameName);
    const losses = totalGames - wins;
    
    const championKDA = getChampionsKDA(matchHistory, gameName);
    const playerMeanKda = championKDA.reduce((acc, champion) => acc + champion.meanKda, 0) / championKDA.length;
    return(
        <div className="stats section">
            <div className="stats subsection black-box-hover">
                <WinrateCircle wins={wins} totalGames={totalGames} losses={losses} playerMeanKda={playerMeanKda}/>
                <div className="best-champion-kda">
                    <p>Recent {totalGames} games played champion:</p>
                    {Object.values(championKDA)
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