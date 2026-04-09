import { useState } from 'react';
import './JoinScreen.css';

export default function JoinScreen({ onJoin }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) onJoin(name.trim());
    };

    return (
        <div className="join-screen">
            <div className="join-card">
                <form onSubmit={handleSubmit} className="join-card__form">
                    <input
                        type="text"
                        className="join-card__input"
                        placeholder="Team name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        autoFocus
                        maxLength={20}
                    />
                    <button type="submit" className="join-card__button" disabled={!name.trim()}>
                        Join
                    </button>
                </form>
            </div>
        </div>
    );
}
