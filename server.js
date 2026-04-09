import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 3001;
const wss = new WebSocketServer({ port: PORT });

// Game state
const teams = {}; // { teamName: { cells: { 'r-c': 'A', ... }, variant: 'A' | 'B', completed?: boolean } }
const projectors = new Set();
const players = new Map(); // ws -> teamName
let gameWinner = null;

import { getCrosswordVariant } from './src/crosswordData.js';

function pickVariantForNewTeam() {
    const counts = { A: 0, B: 0 };
    for (const teamState of Object.values(teams)) {
        const variant = teamState.variant === 'B' ? 'B' : 'A';
        counts[variant] += 1;
    }
    return counts.A <= counts.B ? 'A' : 'B';
}

function checkComplete(cells, variant) {
    const crosswordData = getCrosswordVariant(variant);
    const { GRID, ROWS, COLS, PREFILLED = {} } = crosswordData;
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

function clearGameState() {
    for (const teamName of Object.keys(teams)) {
        delete teams[teamName];
    }
    gameWinner = null;
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
            console.log('Projector connected');
        }

        else if (msg.type === 'join') {
            const team = msg.team;
            players.set(ws, team);
            if (!teams[team]) {
                teams[team] = { cells: {}, variant: pickVariantForNewTeam() };
            }
            ws.send(JSON.stringify({
                type: 'joined',
                team,
                variant: teams[team].variant,
                cells: teams[team].cells
            }));
            broadcast({ type: 'team_joined', team });
            // Send full state to projectors
            broadcast({ type: 'state', teams });
            console.log(`Team "${team}" joined`);
        }

        else if (msg.type === 'cell') {
            const team = msg.team;
            if (!teams[team]) teams[team] = { cells: {}, variant: pickVariantForNewTeam() };
            const teamState = teams[team];
            teamState.cells[`${msg.r}-${msg.c}`] = msg.value;

            // Broadcast cell update to projectors
            broadcast({
                type: 'cell',
                team,
                r: msg.r,
                c: msg.c,
                value: msg.value
            });

            // Check completion
            if (!teamState.completed && checkComplete(teamState.cells, teamState.variant)) {
                teamState.completed = true;
                console.log(`Team "${team}" completed the crossword!`);
                if (!gameWinner) {
                    gameWinner = team;
                }
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
            for (const client of players.keys()) {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ type: 'team_kicked', team }));
                }
            }
            if (Object.keys(teams).length === 0) {
                gameWinner = null;
                broadcast({ type: 'state', teams });
            }
            console.log(`Team "${team}" was kicked`);
        }

        else if (msg.type === 'reset_game') {
            const kickedTeams = Object.keys(teams);

            // Notify all players before closing their sockets.
            for (const client of players.keys()) {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({ type: 'game_reset' }));
                }
            }

            clearGameState();
            broadcast({ type: 'state', teams });
            broadcast({ type: 'game_reset' });

            // Disconnect all player clients ("kick everybody")
            for (const [client] of Array.from(players.entries())) {
                try {
                    client.close();
                } catch {
                    // ignore close errors
                }
                players.delete(client);
            }

            console.log(`Game reset by projector. Cleared ${kickedTeams.length} teams.`);
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
