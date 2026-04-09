import { useEffect, useRef, useState } from 'react';
import Crossword from '../components/Crossword';
import './ProjectorScreen.css';

export default function ProjectorScreen({ wsUrl }) {
    const [teams, setTeams] = useState({});
    const [winner, setWinner] = useState(null);
    const wsRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'projector' }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);

            if (msg.type === 'state') {
                setTeams(msg.teams);
            } else if (msg.type === 'cell') {
                setTeams(prev => ({
                    ...prev,
                    [msg.team]: {
                        ...(prev[msg.team] || {}),
                        cells: {
                            ...((prev[msg.team] || {}).cells || {}),
                            [`${msg.r}-${msg.c}`]: msg.value
                        }
                    }
                }));
            } else if (msg.type === 'team_joined') {
                setTeams(prev => ({
                    ...prev,
                    [msg.team]: prev[msg.team] || { cells: {} }
                }));
            } else if (msg.type === 'team_kicked') {
                setTeams(prev => {
                    const next = { ...prev };
                    delete next[msg.team];
                    return next;
                });
            } else if (msg.type === 'complete') {
                setWinner(msg.team);
            }
        };

        return () => ws.close();
    }, [wsUrl]);

    const kickTeam = (teamName) => {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'kick', team: teamName }));
        }
    };

    const teamNames = Object.keys(teams);

    return (
        <div className="projector-screen">
            {teamNames.length === 0 && (
                <div className="projector-screen__waiting">
                    Waiting for teams to join...
                </div>
            )}

            <div className="projector-screen__boards">
                {teamNames.map(name => (
                    <div key={name} className={`projector-screen__team ${winner === name ? 'projector-screen__team--winner' : ''}`}>
                        <div className="projector-screen__team-header">
                            {winner === name && <span className="projector-screen__winner-badge">WINNER</span>}
                            <span className="projector-screen__team-label">{name}</span>
                            <button
                                className="projector-screen__kick-btn"
                                onClick={() => kickTeam(name)}
                                title={`Kick ${name}`}
                            >
                                ✕
                            </button>
                        </div>
                        <Crossword
                            readOnly
                            compact
                            externalState={(teams[name] || {}).cells || {}}
                        />
                    </div>
                ))}
            </div>

            {winner && (
                <div className="projector-screen__winner-overlay">
                    <div className="projector-screen__winner-text">
                        {winner} wins!
                    </div>
                </div>
            )}
        </div>
    );
}
