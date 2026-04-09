import { useEffect, useRef, useCallback } from 'react';
import Crossword from '../components/Crossword';
import './PlayScreen.css';

export default function PlayScreen({ teamName, wsUrl }) {
    const wsRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'join', team: teamName }));
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
                teamName={teamName}
                onCellChange={handleCellChange}
            />
        </div>
    );
}
