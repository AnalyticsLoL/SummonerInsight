import React, {useEffect, useState} from 'react';
import { useGlobal } from '../../../Context';

import { championIconPath } from '../../../constants';
import { fetchChampionData } from '../../../api';

import '../../../assets/css/pages/SummonerPage/components/ChampionComponent.css';

export default function ChampionComponent({ championId, isTooltip, hasBorder }) {
    const [isFetching, setIsFetching] = useState(true);
    const [champion, setChampion] = useState({});
    const { setIsLoadingGlobal } = useGlobal();

    useEffect(() => {
        const loadingChampion = async (championId) => {
            const loadedChampion = await fetchChampionData(championId, setIsFetching);
            if (loadedChampion) {
                setChampion(loadedChampion);
                setIsFetching(false);
            }
        };
        loadingChampion(championId);
    },[championId]);

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