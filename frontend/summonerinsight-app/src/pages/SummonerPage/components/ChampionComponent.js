import React, {useRef, useEffect, useState} from 'react';

import { championIconPath } from '../../../constants';
import { fetchChampionData } from '../../../api';

import '../../../assets/css/pages/SummonerPage/components/ChampionComponent.css';

export default function ChampionComponent({ championId, isTooltip, hasBorder }) {
    const isLoading = useRef(true);
    const [champion, setChampion] = useState({});

    useEffect(() => {
        const loadingChampion = async (championId) => {
            const loadedChampion = await fetchChampionData(championId, isLoading);
            if (loadedChampion) {
                setChampion(loadedChampion);
                isLoading.current = false;
            }
        };
        loadingChampion(championId);
    },[championId]);

    if(isLoading.current){
        return;
    }
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