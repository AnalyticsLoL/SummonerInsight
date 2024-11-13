import React, { useEffect, useState } from 'react';

import { championIconPath, championFullData, championPassivePath } from '../../../constants';

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
                <div className='stats'>
                    <h5>Stats level 1 (+/level)</h5>
                    <p>HP: {detailedChamp.stats.hp} (+ {detailedChamp.stats.hpperlevel})</p>
                    <p>HP Regeneration: {detailedChamp.stats.hpregen} (+ {detailedChamp.stats.hpregenperlevel})</p>
                    {detailedChamp.partype === "Mana" ? (
                        <div>
                            <p>Mana: {detailedChamp.stats.mp} (+ {detailedChamp.stats.mpperlevel})</p>
                            <p>Mana Regeneration: {detailedChamp.stats.mpregen} (+ {detailedChamp.stats.mpregenperlevel})</p>
                        </div>
                        )
                    :null}
                    <p>MS: {detailedChamp.stats.movespeed}</p>
                    <p>Armor: {detailedChamp.stats.armor} (+ {detailedChamp.stats.armorperlevel})</p>
                    <p>Magic Armor: {detailedChamp.stats.spellblock} (+ {detailedChamp.stats.spellblockperlevel})</p>
                    <p>Attack Range: {detailedChamp.stats.attackrange}</p>
                    <p>Attack Damage: {detailedChamp.stats.attackdamage} (+ {detailedChamp.stats.attackdamageperlevel})</p>
                    <p>Attack Speed: {detailedChamp.stats.attackspeed} (+ {detailedChamp.stats.attackspeedperlevel})</p>
                </div>
                <div className='abilities'>
                    <h5>Abilities</h5>
                    <div className='ability-list'>
                        <SpellComponent spell={detailedChamp.passive} isPassive={true}/>
                        {Object.values(detailedChamp.spells).map((spell, index) => (
                            <SpellComponent key={index} spell={spell} isPassive={false} index={index}/>
                        ))}
                    </div>
                </div>
            </div>)}
        </div>
    );
}