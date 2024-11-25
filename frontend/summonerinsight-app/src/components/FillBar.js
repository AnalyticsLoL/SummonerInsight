import React from 'react';

import '../assets/css/components/FillBar.css';

export default function FillBar({value, maxValue}) {
    let percentage;
    if (value < maxValue) {
        percentage = (value / maxValue) * 100;
    } else {
        percentage = 100;
    }
    return (
        <div className="progress">
            <div className="fill" style={{width: `${percentage}%`}}/>
        </div>
    );
}