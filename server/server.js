const { WebSocketServer } = require('ws'); 

const wss = new WebSocketServer({ port: 8080 }, () => {
console.log('OmniSync WebSocket Server running on port 8080');
}); 

// Store active party sessions: { roomId: { users: Set, hostState: {} } }
const sessions = new Map(); 

wss.on('connection', (ws) => {
let currentRoom = null;
let userId = Math.random().toString(36).substring(2, 9); 

ws.on('message', (message) => {
try {
const data = JSON.parse(message);
    switch (data.type) {
        case 'JOIN':
            currentRoom = data.roomId;
            if (!sessions.has(currentRoom)) {
                sessions.set(currentRoom, { users: new Set(), lastKnownState: null });
            }
            sessions.get(currentRoom).users.add(ws);
            ws.send(JSON.stringify({ type: 'JOINED', userId, state: sessions.get(currentRoom).lastKnownState }));
            console.log(`User ${userId} joined room: ${currentRoom}`);
            break;

        case 'SYNC_STATE':
            if (currentRoom && sessions.has(currentRoom)) {
                const session = sessions.get(currentRoom);
                session.lastKnownState = {
                    currentTime: data.currentTime,
                    isPlaying: data.isPlaying,
                    updatedAt: Date.now()
                };
                
                // Broadcast updated media state to all other users in the room
                session.users.forEach((client) => {
                    if (client !== ws && client.readyState === ws.OPEN) {
                        client.send(JSON.stringify({
                            type: 'STATE_CHANGED',
                            ...session.lastKnownState
                        }));
                    }
                });
            }
            break;

        case 'HEARTBEAT':
            ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
            break;
    }
} catch (err) {
    console.error('Failed to process incoming message:', err);
}

});

ws.on('close', () => {
if (currentRoom && sessions.has(currentRoom)) {
const session = sessions.get(currentRoom);
session.users.delete(ws);
if (session.users.size === 0) {
sessions.delete(currentRoom);
console.log(Room ${currentRoom} terminated due to inactivity.);
}
}
});

});
