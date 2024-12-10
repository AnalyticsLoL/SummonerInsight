import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../assets/css/components/UserMessage.css';

import { messages } from "../constants";

export default function UserMessage({ message, isVanishing, messageType}) {
    return (
        <div className={`message ${isVanishing ? 'vanishing' : ''} ${messageType}`}>
            <div className="message-content">
                <p><FontAwesomeIcon icon={messages.find(message => message.name === messageType).icon} /> {message}</p>
            </div>
        </div>
    );
}