import React from 'react';

import { championIconPath, championFullData } from '../../../constants';

import '../../../assets/css/pages/SummonerPage/components/ChampionComponent.css';

export default function ChampionComponent({ championId, isTooltip, hasBorder }) {
    const champion = Object.values(championFullData.data).find(champion => champion.key === championId.toString());
    return (
        <div className="champion">
            <img style={hasBorder?null:{border: "none"}} src={`${championIconPath}/${champion.image.full}`} alt="Champion Icon" />
            {isTooltip && (<div className='tooltip'>
                <div className='header'>
                    <img src={`${championIconPath}/${champion.image.full}`} alt="Champion Icon" />
                    <h4>{champion.name}, {champion.title}</h4>
                </div>
                <p>{champion.blurb}</p>
            </div>)}
        </div>
    );
}