const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let lobbies = {}; // Store lobbies in memory: { "ip:port": { name, players, lastSeen } }

// 1. Host announces their lobby
app.post('/announce', (req, res) => {
    const { name, port, players } = req.body;
    const ip = req.ip.replace('::ffff:', ''); // Get the requester's Public IP
    const id = `${ip}:${port}`;

    lobbies[id] = { name, ip, port, players, lastSeen: Date.now() };
    res.status(200).send({ message: "Lobby listed!" });
});

// 2. Clients get the list
app.get('/list', (req, res) => {
    // Clean up old lobbies (older than 60s) before sending
    const now = Date.now();
    Object.keys(lobbies).forEach(id => {
        if (now - lobbies[id].lastSeen > 60000) delete lobbies[id];
    });
    res.json(Object.values(lobbies));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Master Server live on port ${PORT}`));