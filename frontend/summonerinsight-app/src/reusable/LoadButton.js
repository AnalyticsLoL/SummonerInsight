import '../assets/css/reusable/LoadButton.css';


export default function LoadButton({ onClick, text, isFetching, icon }) {
    return (
        <span
            className={`search_button ${isFetching.current ? 'loading' : ''}`}
            onClick={onClick}
        >
            {isFetching.current ? (
                <span className="spinner"></span>
            ) : (
                text ? <p>{text}</p> : icon
            )}
        </span>
    );
}