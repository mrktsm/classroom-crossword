import { WebSocketServer } from 'ws';

const PORT = 3001;
const wss = new WebSocketServer({ port: PORT });

// Game state
const teams = {}; // { teamName: { cells: { 'r-c': 'A', ... } } }
const projectors = new Set();
const players = new Map(); // ws -> teamName
let gameWinner = null;

// The correct grid for completion checking
const GRID = [
    ['S', 'H', 'R', 'O', 'U', 'D', null, null, 'E', null, 'L', null, 'F'],
    ['L', null, null, 'R', null, 'A', 'D', 'A', 'M', 'S', 'A', 'L', 'E'],
    ['I', null, 'S', 'A', 'R', 'I', null, null, 'E', null, 'T', null, 'I'],
    ['G', 'R', 'A', 'T', 'I', 'S', null, 'O', 'R', 'P', 'H', 'A', 'N'],
    ['H', null, 'N', 'O', 'D', null, 'F', null, 'A', 'L', 'E', 'R', 'T'],
    ['T', 'I', 'E', 'R', null, 'J', 'E', 'L', 'L', 'Y', null, 'E', null],
    [null, 'N', null, null, 'D', 'A', 'T', 'E', 'D', null, null, 'A', null],
    [null, 'A', null, 'H', 'A', 'B', 'I', 'T', null, 'V', 'E', 'S', 'T'],
    ['I', 'N', 'F', 'U', 'N', null, 'D', null, 'B', 'I', 'D', null, 'W'],
    ['S', 'E', 'L', 'E', 'C', 'T', null, 'N', 'E', 'G', 'A', 'T', 'E'],
    ['L', null, 'O', null, 'E', null, null, 'A', 'T', 'O', 'M', null, 'L'],
    ['A', 'C', 'C', 'U', 'R', 'A', 'C', 'Y', null, 'U', null, null, 'V'],
    ['M', null, 'K', null, 'S', null, null, 'S', 'O', 'R', 'T', 'I', 'E'],
];

function checkComplete(cells) {
    for (let r = 0; r < 13; r++) {
        for (let c = 0; c < 13; c++) {
            if (GRID[r][c] !== null) {
                const key = `${r + 1}-${c + 1}`;
                const val = cells[key];
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

console.log(`WebSocket server running on ws://localhost:${PORT}`);
