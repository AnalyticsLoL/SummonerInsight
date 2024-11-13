import React from "react";
import { championSpellPath, championPassivePath } from '../../../constants';

import '../../../assets/css/pages/SummonerPage/components/SpellComponent.css';

export default function SpellComponent({ spell, isPassive, index }) {
    const spellOrder = ['Q', 'W', 'E', 'R'];
    return (
        <div className={`${isPassive?'passive':''} spell`}>
            <img className="spell-icon" src={`${isPassive? championPassivePath : championSpellPath}/${spell.image.full}`} alt={`${isPassive?'Passive':'Ability'} Icon`} />
             {isPassive ? 
                (<p>P</p>)
                :(<p>{spellOrder[index]}</p>)
             }
        </div>  
    );
}