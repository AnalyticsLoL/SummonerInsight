import React from "react";
import { useSelector } from 'react-redux';

import '../../../assets/css/pages/SummonerPage/SummonerInfoSection/MasterySection.css';

import { championMasteriesIcons, championIconPath, gradeGPA, rewardTypes, championFullData } from "../../../constants.js";

import { getTimeDifference } from "../../../reusable/UnixTimeConvert.js";
import FillBar from "../../../components/FillBar.js";
import ChampionComponent from "../components/ChampionComponent.js";

function MasteryElement({mastery}){
    const requiredGrades = (mastery) => {
        return Object.entries(mastery.nextMilestoneRequirements.requireGradeCounts).map(([grade, count]) => {
            if (!mastery.milestoneGrades) {
                return Array.from({ length: count }, (_, i) => ({ [grade]: i < false }));
            }
            const achievedCount = mastery.milestoneGrades.filter(g => gradeGPA[g] >= gradeGPA[grade]).length;
            return Array.from({ length: count }, (_, i) => ({ [grade]: i < achievedCount }));
        }).flat();
    }
    const masteryIcon = mastery.championLevel <= 10 ? 
        championMasteriesIcons.find(championMasteryIcon => championMasteryIcon.masteryId === mastery.championLevel).masteryIcon :
        championMasteriesIcons.find(championMasteryIcon => championMasteryIcon.masteryId === 10).masteryIcon;
    return (
        <div className="champion-mastery subsection black-box-hover">
            <figure>
                <div className="image-container">
                    <img src={`${championIconPath}/${mastery.champion.image.full}`} alt="Champion Icon" />
                </div>
                <div className="mastery-icon">
                    <img src={masteryIcon} alt="Mastery Icon" />
                </div>
            </figure>
            <div className="tooltip">
                <div className="header">
                    <ChampionComponent championId={mastery.championId} isTooltip={false} hasBorder={false}/>
                    <h3>Mastery level {mastery.championLevel}</h3>
                    <div className="mastery-icon">
                        <img src={masteryIcon} alt="Mastery Icon" />
                    </div>
                </div>
                <div className="content">
                    <div className="mastery-requirements">
                        <h4>Next level requirements</h4>
                        <div className="mp-requirements">
                            <p>{(mastery.championPoints).toLocaleString()}</p>
                            <FillBar value={mastery.championPointsSinceLastLevel} maxValue={mastery.championPointsSinceLastLevel+mastery.championPointsUntilNextLevel}/>
                            <p>{(mastery.championPoints - mastery.championPointsSinceLastLevel + mastery.championPointsUntilNextLevel).toLocaleString()}</p>
                        </div>
                        {mastery.markRequiredForNextLevel>0 &&(
                                    mastery.markRequiredForNextLevel>1?
                                    <p>{mastery.markRequiredForNextLevel} Marks of masteries</p>:
                                    <p>{mastery.markRequiredForNextLevel} Mark of mastery</p>
                                )}
                    </div>
                    <div className="milestone">
                        <h4>Milestone {mastery.championSeasonMilestone+1}</h4>
                        <div className="milestone-requirements">
                            <div className="milestone-grades">
                                {requiredGrades(mastery).map((grades) => {
                                    return Object.entries(grades).map(([grade, isAchieved],index) => (
                                        <div key={index} className={`grade ${isAchieved ? 'achieved' : 'not-achieved'}`}>
                                            <p>{grade}</p>
                                        </div>
                                    ))}
                                )}
                            </div>
                        </div>
                        <div className="milestone-reward">
                            <p>Next level reward: </p>
                            {mastery.nextMilestoneRequirements.rewardType && 
                                <p>{rewardTypes.find(reward => reward.type === mastery.nextMilestoneRequirements.rewardType).name}</p>
                            }
                            {mastery.nextMilestoneRequirements.rewardMarks>0 &&(
                                mastery.nextMilestoneRequirements.rewardMarks>1?
                                <p>{mastery.nextMilestoneRequirements.rewardMarks} Mark of masteries</p>:
                                <p>{mastery.nextMilestoneRequirements.rewardMarks} Mark of mastery</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <p>Last played: {getTimeDifference(mastery.lastPlayTime)}</p>
                </div>
            </div>
        </div>
    );
};

export default function MasterySection(){
    const summonerData = useSelector((state) => state.summoner);
    const initialMasteries= summonerData.summonerInfo.championMastery;

    const championMasteries = initialMasteries.map(mastery => {
        const champion = Object.values(championFullData.data).find(champion => champion.key === mastery.championId.toString());
        return { ...mastery, champion };
    });
    return(
        <div className="masteries section">
            {championMasteries.map((mastery, index) => (
                <MasteryElement key={index} mastery={mastery}/>
            ))}
        </div>
    );
};