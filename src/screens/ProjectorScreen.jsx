import { useEffect, useRef, useState } from 'react';
import Crossword from '../components/Crossword';
import { fireConfetti } from '../utils/fireConfetti';
import './ProjectorScreen.css';

export default function ProjectorScreen({ wsUrl }) {
    const [teams, setTeams] = useState({});
    const [revealCorrect, setRevealCorrect] = useState(false);
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
            } else if (msg.type === 'control_state') {
                setRevealCorrect(Boolean(msg.revealCorrect));
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
                const name = msg.team;
                fireConfetti();
                setTeams(prev => ({
                    ...prev,
                    [name]: {
                        ...(prev[name] || { cells: {} }),
                        completed: true
                    }
                }));
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

    const toggleRevealCorrect = () => {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'set_reveal_correct',
                value: !revealCorrect
            }));
        }
    };

    const teamNames = Object.keys(teams);

    return (
        <div className="projector-screen">
            <div className="projector-screen__controls">
                <button
                    className={`projector-screen__control-btn ${revealCorrect ? 'projector-screen__control-btn--active' : ''}`}
                    onClick={toggleRevealCorrect}
                >
                    {revealCorrect ? 'Hide Correct Letters' : 'Reveal Correct Letters'}
                </button>
            </div>
            {teamNames.length === 0 && (
                <div className="projector-screen__waiting">
                    Waiting for teams to join...
                </div>
            )}

            <div className="projector-screen__boards">
                {teamNames.map(name => (
                    <div key={name} className="projector-screen__team">
                        <div className="projector-screen__team-header">
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
                            variant={(teams[name] || {}).variant || 'A'}
                            status={(teams[name] || {}).completed ? 'won' : 'playing'}
                            showCorrect={revealCorrect || !!(teams[name] || {}).completed}
                            externalState={(teams[name] || {}).cells || {}}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
