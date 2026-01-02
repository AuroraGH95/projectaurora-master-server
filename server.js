const express = require('express');
const cors = require('cors');
const app = express();

// CRITICAL for Render: This lets Express see the actual player IP 
// instead of Render's internal proxy IP.
app.set('trust proxy', true); 

app.use(cors());
app.use(express.json());

let lobbies = {};

// A simple "Home" route so the link doesn't show "Not Found"
app.get('/', (req, res) => {
    res.send("<h1>Project Aurora Master Server is Online</h1><p>The game uses this to list lobbies.</p>");
});

// 1. Host announces their lobby
app.post('/announce', (req, res) => {
    const { name, port, players } = req.body;
    // req.ip will now work correctly thanks to 'trust proxy'
    const ip = req.ip.replace('::ffff:', ''); 
    const id = `${ip}:${port}`;

    lobbies[id] = { name, ip, port, players, lastSeen: Date.now() };
    console.log(`Lobby Added: ${name} at ${id}`);
    res.status(200).send({ message: "Lobby listed!" });
});

// 2. Clients get the list
app.get('/list', (req, res) => {
    const now = Date.now();
    // Clean up old lobbies (older than 60s)
    Object.keys(lobbies).forEach(id => {
        if (now - lobbies[id].lastSeen > 60000) delete lobbies[id];
    });
    res.json(Object.values(lobbies));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Master Server live on port ${PORT}`));
