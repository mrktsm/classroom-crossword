import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 3001;
const wss = new WebSocketServer({ port: PORT });

// Game state
const teams = {}; // { teamName: { cells: { 'r-c': 'A', ... } } }
const projectors = new Set();
const players = new Map(); // ws -> teamName
let gameWinner = null;

import { getCrosswordVariant } from './src/crosswordData.js';

// We could choose variant A or B here, or based on ENV var
const variant = process.env.CROSSWORD_VARIANT || 'A';
const crosswordData = getCrosswordVariant(variant);
const GRID = crosswordData.GRID;
const ROWS = crosswordData.ROWS;
const COLS = crosswordData.COLS;
const PREFILLED = crosswordData.PREFILLED;

function checkComplete(cells) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (GRID[r][c] !== null) {
                const key = `${r + 1}-${c + 1}`;
                const val = cells[key] || PREFILLED[key];
                if (!val || val.toUpperCase() !== GRID[r][c].toUpperCase()) return false;
            }
        }
    }
    return true;
}

function broadcast(msg, exclude = null) {
    const data = JSON.stringify(msg);
    for (const client of projectors) {
        if (client !== exclude && client.readyState === 1) {
            client.send(data);
        }
    }
}

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (raw) => {
        let msg;
        try {
            msg = JSON.parse(raw);
        } catch {
            return;
        }

        if (msg.type === 'projector') {
            projectors.add(ws);
            // Send current state
            ws.send(JSON.stringify({ type: 'state', teams }));
            if (gameWinner) {
                ws.send(JSON.stringify({ type: 'complete', team: gameWinner }));
            }
            console.log('Projector connected');
        }

        else if (msg.type === 'join') {
            const team = msg.team;
            players.set(ws, team);
            if (!teams[team]) {
                teams[team] = { cells: {} };
            }
            broadcast({ type: 'team_joined', team });
            // Send full state to projectors
            broadcast({ type: 'state', teams });
            if (gameWinner) {
                ws.send(JSON.stringify({ type: 'complete', team: gameWinner }));
            }
            console.log(`Team "${team}" joined`);
        }

        else if (msg.type === 'cell') {
            if (gameWinner) return; // Block submissions if someone already won!

            const team = msg.team;
            if (!teams[team]) teams[team] = { cells: {} };
            teams[team].cells[`${msg.r}-${msg.c}`] = msg.value;

            // Broadcast cell update to projectors
            broadcast({
                type: 'cell',
                team,
                r: msg.r,
                c: msg.c,
                value: msg.value
            });

            // Check completion
            if (checkComplete(teams[team].cells)) {
                console.log(`Team "${team}" completed the crossword!`);
                gameWinner = team;
                broadcast({ type: 'complete', team });
                // Notify all players
                for (const client of players.keys()) {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify({ type: 'complete', team }));
                    }
                }
            }
        }

        else if (msg.type === 'kick') {
            const team = msg.team;
            // Remove team state
            delete teams[team];
            // Close the kicked player's connection
            for (const [client, clientTeam] of players.entries()) {
                if (clientTeam === team) {
                    client.close();
                    players.delete(client);
                }
            }
            // Notify projectors
            broadcast({ type: 'team_kicked', team });
            console.log(`Team "${team}" was kicked`);
        }
    });

    ws.on('close', () => {
        projectors.delete(ws);
        const team = players.get(ws);
        if (team) {
            players.delete(ws);
            console.log(`Team "${team}" disconnected`);
        }
    });
});

console.log(`WebSocket server running on port ${PORT}`);
