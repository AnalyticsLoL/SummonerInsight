import React from 'react';
import { championIconPath, championSplashPath } from '../../../constants';

import '../../../assets/css/pages/SummonerPage/components/ChampionComponent.css';

export default function ChampionComponent({ champion, isTooltip }) {
    return (
        <div className="champion">
            <img src={`${championIconPath}/${champion.image.full}`} alt="Champion Icon" />
            {isTooltip && (<div className='tooltip' style={{backgroundImage: `url(${championSplashPath}/${champion.image.full.replace('.png','')}_0.jpg)`}}>
                <h4>{champion.name}, {champion.title}</h4>
                <p>{champion.blurb}</p>
                <p>See more...</p>
            </div>)}
        </div>
    );
}