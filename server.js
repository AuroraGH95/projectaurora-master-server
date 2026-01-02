import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let activeLobbies = [];

// 1. Host registers their lobby here
app.post('/announce', (req, res) => {
    const { username, lobbyName } = req.body;
    const publicIp = req.ip.replace('::ffff:', ''); 
    
    // Remove old lobby from same IP if it exists
    activeLobbies = activeLobbies.filter(l => l.ip !== publicIp);
    
    activeLobbies.push({
        username,
        lobbyName,
        ip: publicIp,
        lastSeen: Date.now()
    });
    res.json({ success: true });
});

// 2. Clients get the list here
app.get('/lobbies', (req, res) => {
    // Clean up dead lobbies (older than 30 seconds)
    activeLobbies = activeLobbies.filter(l => Date.now() - l.lastSeen < 30000);
    res.json(activeLobbies);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Master Server on port ${PORT}`));
