import '../assets/css/components/LoadButton.css';
import { useState, useEffect } from 'react';


export default function LoadButton({ onClick, text, isFetching, icon }) {
    const [loading, setLoading] = useState(isFetching.current);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoading(isFetching.current);
        }, 200);

        return () => clearInterval(interval);
    }, [isFetching]);

    return (
        <span
            className={`search_button ${loading ? 'loading' : ''}`}
            onClick={onClick}
        >
            {loading ? (
                <span className="spinner"></span>
            ) : (
                text ? <p>{text}</p> : icon
            )}
        </span>
    );
}