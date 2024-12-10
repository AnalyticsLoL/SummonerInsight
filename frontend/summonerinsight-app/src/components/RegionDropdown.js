import React, {useState, useRef, useEffect} from "react";

import '../assets/css/components/RegionDropdown.css';

import {regions} from '../constants.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';

export default function RegionDropdown({setRegionTag, intialRegionName, regionTag}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [regionName, setRegionName] = useState(intialRegionName);
    const dropdownRef = useRef(null);

    const handleDropdownClick = (region) => {
        setDropdownOpen(false);
        setRegionTag(region.regionTag);
        setRegionName(region.regionName);
    };

    useEffect(() => {
        const handleEscPress = (event) => {
            if (event.key === 'Escape') {
                setDropdownOpen(false);
            }
        };
        
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscPress);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleEscPress);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    },[]);

    return (
        <div ref={dropdownRef} className={`${regionTag?'small':''} region_dropdown`} onClick={() => setDropdownOpen(!dropdownOpen)}>
            {regionTag ? (
            <div className='header'>
                <p>{regionTag.replace(/\d+/g, '')}</p>
                <FontAwesomeIcon icon={dropdownOpen?faChevronUp : faChevronDown} />
            </div>) :
            (<div className='header'>
                <span>Region:</span>
                <FontAwesomeIcon icon={dropdownOpen?faChevronUp : faChevronDown} />
                <p>{regionName}</p>
            </div>)}

            {dropdownOpen && (
                <div className="menu">
                    {regions.map((region, index) => (
                        <span key={index} className='item' onClick={() => handleDropdownClick(region)}>
                            {regionTag ? (
                                <p>{region.regionTag.replace(/\d+/g, '')}</p>
                            ) : (
                                <span>
                                    <region.regionIcon />
                                    <p>{region.regionName}</p>
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}