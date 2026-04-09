import { useEffect, useRef, useCallback, useState } from 'react';
import Crossword from '../components/Crossword';
import { fireConfetti } from '../utils/fireConfetti';
import './PlayScreen.css';

function sameTeam(a, b) {
    return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
}

export default function PlayScreen({ teamName, wsUrl }) {
    const wsRef = useRef(null);
    const [variant, setVariant] = useState('A');
    const [status, setStatus] = useState('playing');
    const [roundKey, setRoundKey] = useState(0);
    const [showCorrect, setShowCorrect] = useState(false);
    const celebratedWinRef = useRef(false);

    useEffect(() => {
        if (status === 'won') {
            if (!celebratedWinRef.current) {
                celebratedWinRef.current = true;
                fireConfetti();
            }
        } else {
            celebratedWinRef.current = false;
        }
    }, [status]);

    useEffect(() => {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        setStatus('playing');

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'join', team: teamName }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'joined' && sameTeam(msg.team, teamName)) {
                setVariant(msg.variant || 'A');
                setStatus('playing');
                setRoundKey(prev => prev + 1);
            } else if (msg.type === 'control_state') {
                setShowCorrect(Boolean(msg.revealCorrect));
            } else if (msg.type === 'complete') {
                if (sameTeam(msg.team, teamName)) {
                    setStatus('won');
                    setShowCorrect(true);
                }
            } else if (msg.type === 'team_kicked' && sameTeam(msg.team, teamName)) {
                setStatus('kicked');
            } else if (msg.type === 'game_reset') {
                setStatus('kicked');
                setRoundKey(prev => prev + 1);
            }
        };

        return () => ws.close();
    }, [wsUrl, teamName]);

    const handleCellChange = useCallback((r, c, value) => {
        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'cell',
                team: teamName,
                r, c, value
            }));
        }
    }, [teamName]);

    return (
        <div className="play-screen">
            <Crossword
                key={`${teamName}-${roundKey}`}
                variant={variant}
                status={status}
                showCorrect={showCorrect}
                onCellChange={handleCellChange}
            />
        </div>
    );
}
