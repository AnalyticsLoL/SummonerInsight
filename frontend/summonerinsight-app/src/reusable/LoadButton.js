import '../assets/css/reusable/LoadButton.css';


export default function LoadButton({ onClick, text, isFetching}){
    return (
        <span className={`search_button ${isFetching?'loading':''}`} onClick={onClick}>
            <p>{isFetching ? <span className="spinner"></span> : text}</p>
        </span>
    );
}