import React from "react";

import "../assets/css/components/WinrateCircle.css";

export default function WinrateCircle({wins, totalGames, losses, playerMeanKda}) {
    return (
        <div className="win-loss-ratio">
            <svg className="winrate-circle" width="110" height="110" viewBox="0 0 36 36">
                <circle className="bg-circle" cx="18" cy="18" r="16"></circle>
                <circle className="percent-circle" cx="18" cy="18" r="16"
                        style={{"--percentage": `${wins/totalGames}`}}></circle>
                <text x="18" y="20.35" textAnchor="middle" fontSize="8" fill="#E0E0E0">{(wins/totalGames*100).toFixed(0)}%</text>
            </svg>
            <div className="tooltip">
                <p>{totalGames}G {wins}W {losses}L</p>
                <p>Winrate: {((wins / totalGames) * 100).toFixed(0)}%</p>
                <p>Average {playerMeanKda.toFixed(2)} KDA</p>
            </div>
        </div>
    );
}