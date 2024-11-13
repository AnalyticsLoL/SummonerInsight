import React, { useEffect, useState } from 'react';

import { championIconPath, championFullData } from '../../../constants';

import '../../../assets/css/pages/SummonerPage/components/ChampionComponent.css';
import { fetchChampionData } from '../../../api';
import SpellComponent from './SpellComponent.js';

export default function ChampionComponent({ championId, isTooltip, hasBorder }) {
    const champion = Object.values(championFullData.data).find(champion => champion.key === championId.toString());
    const [detailedChamp, setDetailedChamp] = useState(null);

    useEffect(() => {
        // Fetch detailed data if tooltip is enabled
        if (isTooltip) {
            fetchChampionData(champion.id).then(championDetails => {
                setDetailedChamp(championDetails);
            });
        }
    }, [champion, isTooltip]);

    return (
        <div className="champion">
            <img className="champion-icon" style={hasBorder?null:{border: "none"}} src={`${championIconPath}/${champion.image.full}`} alt="Champion Icon" />
            {isTooltip && detailedChamp && (<div className='tooltip'>
                <div className='header'>
                    <img className="champion-icon" src={`${championIconPath}/${champion.image.full}`} alt="Champion Icon" />
                    <h4>{champion.name}, {champion.title}</h4>
                </div>
                <p>{champion.blurb}</p>
                <div className='tags'>
                    {Object.values(champion.tags).map((tag, index) => (
                        <span key={index} className='tag'>
                            <p>{tag.replace(/([a-z])([A-Z])/g, '$1 $2')}</p>
                        </span>  
                    ))}
                </div>
            </div>)}
        </div>
    );
}