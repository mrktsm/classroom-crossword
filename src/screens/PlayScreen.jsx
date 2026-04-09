import { useEffect, useRef, useCallback, useState } from 'react';
import Crossword from '../components/Crossword';
import './PlayScreen.css';

export default function PlayScreen({ teamName, wsUrl }) {
    const wsRef = useRef(null);
    const [variant, setVariant] = useState('A');
    const [status, setStatus] = useState('playing');
    const [roundKey, setRoundKey] = useState(0);

    useEffect(() => {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;
        setStatus('playing');

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'join', team: teamName }));
        };

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.type === 'joined' && msg.team === teamName) {
                setVariant(msg.variant || 'A');
                setStatus('playing');
                setRoundKey(prev => prev + 1);
            } else if (msg.type === 'complete') {
                if (msg.team === teamName) {
                    setStatus('won');
                }
            } else if (msg.type === 'team_kicked' && msg.team === teamName) {
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
                onCellChange={handleCellChange}
            />
        </div>
    );
}
