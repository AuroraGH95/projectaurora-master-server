const express = require('express');
const cors = require('cors');
const app = express();

// This is very important for Render! 
// It allows the server to see the REAL IP of the players.
app.set('trust proxy', true); 

app.use(cors());
app.use(express.json());

let lobbies = {};

// --- ADD THIS NEW ROUTE HERE ---
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="font-family: sans-serif; text-align: center; padding-top: 50px;">
                <h1>🎸 Project Aurora Master Server</h1>
                <p style="color: green;">✔ Status: Online and Ready</p>
                <p>Lobbies active: ${Object.keys(lobbies).length}</p>
                <hr style="width: 50%; margin: 20px auto;">
                <small>Connected to Render Cloud</small>
            </body>
        </html>
    `);
});
// -------------------------------

app.post('/announce', (req, res) => {
    const { name, port, players } = req.body;
    const ip = req.ip.replace('::ffff:', ''); 
    const id = `${ip}:${port}`;
    lobbies[id] = { name, ip, port, players, lastSeen: Date.now() };
    res.status(200).send({ message: "Lobby listed!" });
});

app.get('/list', (req, res) => {
    const now = Date.now();
    Object.keys(lobbies).forEach(id => {
        if (now - lobbies[id].lastSeen > 60000) delete lobbies[id];
    });
    res.json(Object.values(lobbies));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Master Server live on port ${PORT}`));
