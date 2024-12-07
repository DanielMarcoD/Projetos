import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import { Link } from 'react-router-dom';

export default function AppBar() {
    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <div to="/" className="navbar-item">
                    <img src="logo.png" alt="Logo" className="logo"/>
                    <span className="subtitle">Meu Game Favorito</span>
                </div>
                
            </div>
        </nav>
    );
}

