import React from 'react';

import { itemIconPath, itemFullData } from '../../../constants';
import { parseDescriptionToJson } from '../../../reusable/convert';

import '../../../assets/css/pages/SummonerPage/components/ItemComponent.css';

const description = (itemDescription) => {
    const descriptionObject = parseDescriptionToJson(itemDescription);
    return(
        <div className='description'>
            {Object.values(descriptionObject.stats).length > 0 && (<div className='stats'>
                <p>Stats: </p>
                <ul>
                    {Object.entries(descriptionObject.stats).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                    ))}
                </ul>
            </div>)}
            {descriptionObject.passive.length > 0 &&(<div className='passives'>
                <p>Passive: </p>
                <ul>
                    {descriptionObject.passive.map((passive, index) => (
                        <li key={index}>{passive.name}: {passive.description}</li>
                    ))}
                </ul>
            </div>)}
            {descriptionObject.active.length > 0 &&(<div className='actives'>
                <p>Active: </p>
                <ul>
                    {descriptionObject.active.map((active, index) => (
                        <li key={index}>{active.name}: {active.description}</li>
                    ))}
                </ul>
            </div>)}
        </div>
    );
}

export default function ItemComponent({ isLastItem, itemId, isTooltip }) {
    if(itemId === 0) {
        return (
            <div id='item' className={`empty ${isLastItem ? 'last' : ''}`}/>
        );
    }
    const item = itemFullData.data[itemId];
    return (
        <div id='item' className={`${ isLastItem? 'last' : ''} black-box-hover`}>
            <img className='item-img' src={`${itemIconPath}/${item.image.full}`} alt="Item Icon" />
            {isTooltip && (<div className='tooltip'>
                <div className='header'>
                    <img src={`${itemIconPath}/${item.image.full}`} alt="Item Icon" />
                    <h4>{item.name}</h4>
                </div>
                <p>{item.plaintext}</p>
                {description(item.description)}
                {item.from && (<div className='from'>
                    <p>Builds from: </p>
                    <div className='items'>
                        {item.from.map((fromId, index) => (
                            <ItemComponent key={index} itemId={fromId} isTooltip={false} isLastItem={false} />
                        ))}
                    </div>
                </div>)}
                {item.into && (<div className='into'>
                    <p>Builds into: </p>
                    <div className='items'>
                        {item.into.map((intoId, index) => (
                            <ItemComponent key={index} itemId={intoId} isTooltip={false} isLastItem={false} />
                        ))}
                    </div>
                </div>)}
                {item.gold.total !==0 && (<p>Cost (Sell): {item.gold.total} ({item.gold.sell})</p>)}
                <div className='tags'>
                    {Object.values(item.tags).map((tag, index) => (
                        <span key={index} className='tag'>
                            <p>{tag.replace(/([a-z])([A-Z])/g, '$1 $2')}</p>
                        </span>  
                    ))}
                </div>
            </div>)}
        </div>
    );
}