import React from 'react';
import { championIconPath, championSplashPath } from '../../../constants';

import '../../../assets/css/pages/SummonerPage/components/ChampionComponent.css';

export default function ChampionComponent({ champion, isTooltip }) {
    return (
        <div className="champion">
            <img src={`${championIconPath}/${champion.image.full}`} alt="Champion Icon" />
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