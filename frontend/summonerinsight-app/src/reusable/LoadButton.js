export default function LoadButton({isLoading, onClick, text}){
    return (
        <button className={`search_button ${isLoading?'loading':''}`} onClick={onClick}>
            {isLoading ? <span className="spinner"></span> : text}
        </button>
    );
}