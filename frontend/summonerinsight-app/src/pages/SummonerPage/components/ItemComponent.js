import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../../Context';

import { itemIconPath } from '../../../constants';
import { fetchItemData } from '../../../api';
import { parseDescriptionToJson } from './reusableFunctions';

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
    const [isFetching, setIsFetching] = useState(true);
    const { setIsLoadingGlobal } = useGlobal();
    const [item, setItem] = useState({});

    useEffect(() => {
        const loadingItem = async (itemId) => {
            const loadedItem = await fetchItemData(itemId, setIsFetching);
            if (loadedItem) {
                setItem(loadedItem);
                setIsFetching(false);
            }
        };
        loadingItem(itemId);
    },[itemId]);

    useEffect(() => {
        // Update global loading state whenever fetching changes
        setTimeout(() => {
            setIsLoadingGlobal(isFetching);
        }, 120);
    }, [isFetching,setIsLoadingGlobal]);

    if(isFetching){
        return;
    }
    return (
        <div className={`item ${ isLastItem? 'last' : ''} black-box-hover`}>
            <img src={`${itemIconPath}/${item.image.full}`} alt="Item Icon" />
            {isTooltip && (<div className='tooltip'>
                <div className='header'>
                    <img src={`${itemIconPath}/${item.image.full}`} alt="Item Icon" />
                    <h4>{item.name}</h4>
                </div>
                <p>Cost: {item.gold.total}</p>
                {description(item.description)}
            </div>)}
        </div>
    );
}