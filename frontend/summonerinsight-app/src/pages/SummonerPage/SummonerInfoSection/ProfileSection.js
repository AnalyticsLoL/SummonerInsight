import React from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

import "../../../assets/css/pages/SummonerPage/SummonerInfoSection/ProfileSection.css";

import { regions, positions, profileIconPath } from "../../../constants.js";

export default function ProfileSection(){
    const { regionTag } = useParams();
    const summonerData = useSelector((state) => state.summoner);

    const summonerProfile = summonerData.summonerInfo.summonerProfile;
    const matchHistory = summonerData.matchHistory;

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