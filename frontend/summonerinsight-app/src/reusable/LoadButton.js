import '../assets/css/reusable/LoadButton.css';
import { useGlobal } from '../Context.js';

export default function LoadButton({ onClick, text}){
    const { isLoading } = useGlobal();
    return (
        <span className={`search_button ${isLoading?'loading':''}`} onClick={onClick}>
            <p>{isLoading ? <span className="spinner"></span> : text}</p>
        </span>
    );
}