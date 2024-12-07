import "./index.css";
import { useState } from "react";

export default function PopUp({ text, onClose }) {
    return (
        <div className="popup">
            <div className="popup-inner">
                <h1>{text}</h1>
                <button onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
}
