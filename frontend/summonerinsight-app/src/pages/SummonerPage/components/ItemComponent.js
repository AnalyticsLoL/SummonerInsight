import React from 'react';
import { itemIconPath } from '../../../constants';

import '../../../assets/css/pages/SummonerPage/components/ItemComponent.css';

const description = (itemDescription) => {
    console.log(itemDescription);
    return(
        <div className='description'>
            {Object.values(itemDescription.stats).length > 0 && (<div className='stats'>
                <p>Stats: </p>
                <ul>
                    {Object.entries(itemDescription.stats).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))}
                </ul>
            </div>)}
            {itemDescription.passive.length > 0 &&(<div className='passives'>
                <p>Passive: </p>
                <ul>
                    {itemDescription.passive.map((passive, index) => (
                        <li key={index}>{passive.name}: {passive.description}</li>
                    ))}
                </ul>
            </div>)}
            {itemDescription.active.length > 0 &&(<div className='actives'>
                <p>Active: </p>
                <ul>
                    {itemDescription.active.map((active, index) => (
                        <li key={index}>{active.name}: {active.description}</li>
                    ))}
                </ul>
            </div>)}
        </div>
    );
}

export default function ItemComponent({ isLastItem, item, isTooltip }) {
    return (
        <div className={`item ${ isLastItem? 'last-item' : ''}`}>
            <img src={`${itemIconPath}/${item.image.full}`} alt="Item Icon" />
            {isTooltip && (<div className='tooltip'>
                <h4>{item.name}</h4>
                {description(item.description)}
                <p>Cost: {item.gold.total}</p>
                <p>See more...</p>
            </div>)}
        </div>
    );
}