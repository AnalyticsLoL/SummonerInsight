import '../assets/css/reusable/LoadButton.css';


export default function LoadButton({ onClick, text, isFetching, icon }) {
    return (
        <span
            className={`search_button ${isFetching ? 'loading' : ''}`}
            onClick={onClick}
        >
            {isFetching ? (
                <span className="spinner"></span>
            ) : (
                text ? <p>{text}</p> : icon
            )}
        </span>
    );
}