import React from 'react';
import { itemIconPath } from '../../../constants';

import '../../../assets/css/pages/SummonerPage/components/ItemComponent.css';

const description = ({XMLstring}) => {

}

export default function ItemComponent({ isLastItem, item, isTooltip }) {
    return (
        <div className={`item ${ isLastItem? 'last-item' : ''}`}>
            <img src={`${itemIconPath}/${item.image.full}`} alt="Item Icon" />
            {isTooltip && (<div className='tooltip'>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>See more...</p>
            </div>)}
        </div>
    );
}